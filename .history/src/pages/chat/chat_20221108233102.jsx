import React, { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import styles from './chat.module.css';
import { chatTime } from '../../util/data';
import { useAuth } from '../../context/AuthContext';
import { FaRegMap } from 'react-icons/fa';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import MapAgreeAlert from '../../components/mapAgreeAlert/mapAgreeAlert';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatService, kakaoService }) => {
  const [inputText, setInputText] = useState('');
  const [myName, setMyName] = useState('');
  const [chats, setChats] = useState([]);
  const [partyid, setPartyid] = useState();
  const [party, setParty] = useState(undefined);
  const { user, setError, userNickName } = useAuth();
  const { location, firstLocation, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const navigate = useNavigate();
  //stomp 연결 플래그
  const [connectFlag, setConnectFlag] = useState(false);

  //사용자 위치공유 동의
  const [agree, setAgree] = useState(false);
  const [agreeAlert, setAgreeAlert] = useState(false);
  const mapRef = useRef();
  const [mainMap, setMainMap] = useState('');
  const [preMarker, setPreMarker] = useState('');
  const [mapSwitch, setMapSwitch] = useState(false);
  const mapContainerRef = useRef();
  const [posSubscribeFlag, setPosSubscribeFlag] = useState(false);
  //사용자들 위치들
  const [usersMarkers, setUsersMarkers] = useState({});
  //무한스크롤
  const observer = useRef();
  const [hasMore, setHasMore] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);
  const chatContainerRef = useRef();

  const contentRef = useRef();
  const inputRef = useRef();
  const onChange = (e) => {
    const {
      target: { name, value, checked },
    } = e;

    switch (name) {
      case 'text':
        return setInputText(value);
    }
  };

  //무한스크롤 부분
  const firstChatElement = useCallback(
    (node) => {
      observer.current && observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            //마지막 스크롤 높이 저장
            setPrevHeight(chatContainerRef.current.scrollHeight);
            chatService
              .getChats(party.id, party.restaurantId, offSet)

              .then((data) => {
                if (data.chats.length > 0) {
                  setChats((c) => [...data.chats, ...c]);
                  setHasMore(true);
                  setOffSet((c) => c + data.chats.length);
                } else {
                  setHasMore(false);
                }
                return;
              })
              .catch((e) => console.log(e));
          }
        },
        { threshold: 1.0 }
      );
      node && observer.current.observe(node);
    },
    [hasMore, offSet]
  );

  useEffect(() => {
    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight - prevHeight;
  }, [chats]);

  const onCreated = (chat) => {
    setChats((chats) => [...chats, chat]);

    contentRef &&
      contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
    return;
  };

  const stompChatSendToServer = (이벤트) => {
    이벤트.preventDefault();
    if (inputText == '') {
      return;
    }

    chatService.onSend('/pub/party/message', {
      roomId: party.chatRoom_id,
      sender: user.nickname,
      message: inputText,
    });
    setOffSet((c) => c + 1);
    setPrevHeight(0);
    //contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });

    setInputText('');
    inputRef.current.focus();
  };

  //socket으로 닉네임이랑 위치를 받아옴
  const movePosition = useCallback(
    (posSocketData, flag) => {
      if (!flag) {
        return;
      }

      let { latitude, longitude, nickname } = posSocketData;
      nickname = nickname.toString();

      if (nickname != user.nickname.toString()) {
        //location이 있으면 usersMarkers에 저장
        if (latitude) {
          const markerPosition = kakaoService.getLatLng(latitude, longitude);
          const marker = kakaoService.getMapMarker(
            markerPosition,
            mainMap,
            nickname
          );

          setUsersMarkers((markers) => {
            markers[nickname] && markers[nickname].setMap(null);
            return { ...markers, [nickname]: marker };
          });
        } else {
          setUsersMarkers((markers) => {
            markers[nickname] && markers[nickname].setMap(null);
            delete markers[nickname];
            return { ...markers };
          });
        }
      }
    },
    [mainMap]
  );

  useEffect(() => {
    let partyId = null;
    let chatRoom_id = null;
    chatService
      .getMyParty()
      .then((party) => {
        partyId = party.id;
        chatRoom_id = party.chatRoom_id;
        setParty({ ...party });
      })
      .catch((e) => {
        setError(e);
        return navigate('/');
      });

    //연결상태 확인해서 connectFlag를 true로 해줌
    if (chatService.connectState()) {
      return setConnectFlag(true);
    }

    chatService.onConnect(() => {
      setConnectFlag(() => {
        console.log('연결플래그가 변경되었습니다.');
        return true;
      });
    });

    return () => {
      if (chatService.connectState()) {
        const nullPosition = {
          roomId: chatRoom_id,
          nickname: user.nickname,
          latitude: null,
          longitude: null,
        };
        chatService.onSend('/pub/party/position', nullPosition);
      }

      chatService.onDisConnect();
      setConnectFlag(false);
    };
  }, [chatService]);

  useEffect(() => {
    //채팅 가져오기
    if (party) {
      chatService
        .getChats(party.id, party.restaurantId, 0)
        .then((data) => {
          console.log(data);
          setChats([...data.chats]);
          data.chats && setHasMore(true);
          data.chats && setOffSet((c) => c + data.chats.length);
          contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
          return;
        })
        .catch((e) => console.log(e));
    }
  }, [chatService, party]);

  useEffect(() => {
    //연결상태 확인해서 구독

    let subChatDisconnected = () => {};

    if (connectFlag && party && chatService.connectState() === true) {
      subChatDisconnected = chatService.onSubscribe(
        party.chatRoom_id,
        '/sub/chat/',
        (e) => {
          const chat = JSON.parse(e.body);

          onCreated(chat);
        }
      );
    }

    return () => {
      subChatDisconnected();
    };
  }, [chatService, connectFlag, party]);

  useEffect(() => {
    //위치 구독
    let flag = true;
    let subPosDisconnected = () => {};
    if (!connectFlag || !party || !agree || !mainMap) {
      return;
    }

    subPosDisconnected = chatService.onSubscribe(
      party.chatRoom_id,
      '/sub/position/',
      (e) => {
        const pos = JSON.parse(e.body);
        movePosition(pos, flag);
      }
    );
    setPosSubscribeFlag(true);

    return () => {
      setPosSubscribeFlag(false);
      subPosDisconnected();
      flag = false;
    };
  }, [chatService, connectFlag, party, agree, mainMap]);

  //지도와 실시간 위치
  useEffect(() => {
    // if (!party || !agree || !firstLocation) {
    //   console.log(party, agree, firstLocation);
    //   console.log('취소');
    //   return;
    // }

    if (!firstLocation) {
      return;
    }

    //메인지도
    const mapContainer = mapRef.current;
    const mapOption = kakaoService.getMapOption(
      firstLocation.latitude,
      firstLocation.longitude
    );
    const map = kakaoService.getNewMap(mapContainer, mapOption);

    setMainMap(map);
    const markerPosition = kakaoService.getLatLng(
      firstLocation.latitude,
      firstLocation.longitude
    );
    const marker = kakaoService.getMapMarker(markerPosition, map);
    setPreMarker(marker);
  }, [chatService, firstLocation]);
  //, party, agree, firstLocation
  //실시간 위치
  useEffect(() => {
    let flag = true;

    if (
      !party ||
      !mapSwitch ||
      !flag ||
      !mainMap ||
      !connectFlag ||
      !location
    ) {
      //if (!location) setError('위치 정보 제공에 동의해 주세요');
      return;
    }

    //사용자가 지도를 키면 위치전송
    if (location && mainMap && mapSwitch) {
      const position = {
        roomId: party.chatRoom_id,
        nickname: user.nickname,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      chatService.onSend('/pub/party/position', position);

      const markerPosition = kakaoService.getLatLng(
        location.latitude,
        location.longitude
      );

      const marker = kakaoService.getMapMarker(markerPosition, mainMap);
      preMarker && preMarker.setMap(null);
      setPreMarker(marker);
    }

    return () => {
      flag = false;
    };
  }, [location, party, mapSwitch, mainMap, connectFlag]);

  useEffect(() => {
    if (mapSwitch) mainMap && mainMap.relayout();
  }, [mapSwitch]);

  useEffect(() => {
    return () => {
      if (connectFlag) {
        chatService.onDisConnect();
      }
    };
  }, [connectFlag]);
  return (
    <section className={styles.container}>
      {agreeAlert && (
        <MapAgreeAlert
          agree={agree}
          setAgree={setAgree}
          setAgreeAlert={setAgreeAlert}
          setMapSwitch={setMapSwitch}
        />
      )}
      <div
        ref={mapContainerRef}
        className={`${styles.map__Container} ${
          mapSwitch ? styles.map__on : styles.map__off
        } `}
      >
        <div
          className={styles.map__header}
          // onDragStart={onDragStartHandler}
          // onDrag={onDragHeandler}
          draggable={true}
        >
          <button
            className={styles.map__closeBtn}
            onClick={useCallback(() => {
              setMapSwitch(false);
            }, [])}
          >
            닫기
          </button>
        </div>
        <div ref={mapRef} className={styles.map__map}></div>
      </div>
      <div className={styles.content} ref={chatContainerRef}>
        {chats && (
          //chat_id, sendTimemessage, sender
          <ul className={styles.chats} ref={contentRef}>
            {chats.map((item, i) => {
              return (
                <li
                  key={item.chatId}
                  className={
                    item.sender.toString() === user.nickname
                      ? styles.chats__mychat
                      : styles.chats__otherchat
                  }
                  ref={i === 0 ? firstChatElement : null}
                >
                  {i === 0 && <p className={styles.nickname}>{item.sender}</p>}

                  {i !== 0 &&
                    (chatTime(item.sendTime) !=
                      chatTime(chats[i - 1].sendTime) ||
                      item.sender !== chats[i - 1].sender) && (
                      <p className={styles.nickname}>{item.sender}</p>
                    )}

                  <div
                    className={`${styles.chats__content} ${
                      item.sender.toString() !== user.nickname &&
                      styles.chats__otherChat
                    }`}
                  >
                    {i === 0 &&
                      chatTime(item.sendTime) !=
                        chatTime(chats[i - 1].sendTime) && (
                        <p className={`${styles.chats__time}`}>
                          {chatTime(item.sendTime)}
                        </p>
                      )}
                    {i !== 0 &&
                      i < chats.length - 1 &&
                      (chatTime(item.sendTime) ==
                      chatTime(chats[i - 1].sendTime)
                        ? (chatTime(item.sendTime) !==
                            chatTime(chats[i + 1].sendTime) ||
                            item.sender !== chats[i + 1].sender) && (
                            <p className={`${styles.chats__time}`}>
                              {chatTime(item.sendTime)}
                            </p>
                          )
                        : (item.sender !== chats[i + 1].sender ||
                            chatTime(item.sendTime) !==
                              chatTime(chats[i + 1].sendTime)) && (
                            <p className={`${styles.chats__time} `}>
                              {chatTime(item.sendTime)}
                            </p>
                          ))}
                    {i === chats.length - 1 && (
                      <p className={`${styles.time} `}>
                        {chatTime(item.sendTime)}
                      </p>
                    )}
                    <p className={styles.chats__chat}>{item.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form className={styles.inputBar} onSubmit={stompChatSendToServer}>
        <IconContext.Provider
          value={{
            size: '3rem',
            style: { cursor: 'pointer' },
            className: styles.icon,
          }}
        >
          <FaRegMap
            onClick={useCallback(() => {
              //한번동의하면 새로고침 전까지 알람창 안띄움
              if (agree) {
                setMapSwitch(true);
                return setAgreeAlert(false);
              }
              setAgreeAlert(true);
            }, [agree])}
          />
        </IconContext.Provider>
        <input
          name='text'
          value={inputText}
          type='text'
          className={styles.input__text}
          ref={inputRef}
          onChange={onChange}
        />
        <button className={styles.sendBtn}>전송</button>
      </form>
    </section>
  );
};

export default Chat;
