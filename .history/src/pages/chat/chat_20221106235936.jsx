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

const Chat = ({ chatService, kakaoService }) => {
  const [inputText, setInputText] = useState('');
  const [myName, setMyName] = useState('');
  const [chats, setChats] = useState([]);
  const [partyid, setPartyid] = useState();
  const [party, setParty] = useState(undefined);
  const { user, setError, userNickName } = useAuth();
  const { location, firstLocation, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);

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
      console.log(node);
      observer.current && observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          console.log('스크롤 감시');
          console.log(hasMore);
          if (entries[0].isIntersecting && hasMore) {
            console.log('스크롤 끝부분');
            //마지막 스크롤 높이 저장
            setPrevHeight(chatContainerRef.current.scrollHeight);
            chatService
              .getChats(party.id, party.restaurantId, offSet)

              .then((data) => {
                console.log('기존에 있던 데이터', chats);
                console.log('받아온 데이터', data);
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
    console.log('새로운', chat);
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
    console.log(chatContainerRef.current.scrollTop);
    setInputText('');
    inputRef.current.focus();
  };

  //socket으로 닉네임이랑 위치를 받아옴
  const movePosition = useCallback(
    (posSocketData, flag) => {
      if (!flag) {
        return;
      }
      console.log('movePosition');
      console.log(posSocketData);
      let { latitude, longitude, nickname } = posSocketData;
      nickname = nickname.toString();

      console.log(mainMap, 'mainMap');
      if (nickname != user.nickname.toString()) {
        //location이 있으면 usersMarkers에 저장
        if (latitude) {
          console.log('maker등록');
          const markerPosition = kakaoService.getLatLng(latitude, longitude);
          const marker = kakaoService.getMapMarker(
            markerPosition,
            mainMap,
            nickname
          );
          console.log(1);
          setUsersMarkers((markers) => {
            console.log(markers[nickname], 'set안에서 등록');
            console.log(markers);
            markers[nickname] && markers[nickname].setMap(null);
            return { ...markers, [nickname]: marker };
          });
        } else {
          setUsersMarkers((markers) => {
            console.log(markers[nickname], 'set안에서 등록');
            console.log(markers);
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
        console.log(party);
        partyId = party.id;
        chatRoom_id = party.chatRoom_id;
        setParty({ ...party });
      })
      .then(setError);

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
      console.log('널전송1');

      chatService.onDisConnect();
      setConnectFlag(false);

      console.log('-------연결종료-------');
    };
  }, [chatService, posSubscribeFlag]);

  useEffect(() => {
    console.log('파티이펙트');
    //채팅 가져오기
    if (party) {
      chatService
        .getChats(party.id, party.restaurantId, 0)
        .then((data) => {
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
    console.log('구독이펙트');
    console.log(connectFlag);
    let subChatDisconnected = () => {
      console.log('chat 구독이 필요합니다');
    };

    if (connectFlag && party && chatService.connectState() === true) {
      console.log('챗구독', chatService.connectState());
      subChatDisconnected = chatService.onSubscribe(
        party.chatRoom_id,
        '/sub/chat/',
        (e) => {
          const chat = JSON.parse(e.body);
          console.log('받은메세지', e.body);
          onCreated(chat);
        }
      );
    }
    console.log('useEffect2');
    return () => {
      console.log('-----구독종료------');
      subChatDisconnected();
    };
  }, [chatService, connectFlag, party]);

  useEffect(() => {
    //위치 구독
    let flag = true;
    let subPosDisconnected = () => {
      console.log('pos 구독이 필요합니다');
    };
    if (!connectFlag || !party || !agree || !mainMap) {
      console.log('위쪽에서 종료');
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
      console.log('----종료---');
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
    console.log('퍼스트로케이션1');
    if (!firstLocation) {
      console.log('퍼스트로케이션2');
      console.log(firstLocation);
      return;
    }

    //메인지도
    const mapContainer = mapRef.current;
    const mapOption = kakaoService.getMapOption(
      firstLocation.latitude,
      firstLocation.longitude
    );
    const map = kakaoService.getNewMap(mapContainer, mapOption);
    console.log('메인지도');
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
    console.log('움직임');

    if (!party || !mapSwitch || !flag || !mainMap || !connectFlag) {
      return;
    }

    if (location && mainMap) {
      console.log('위치전송');
      const position = {
        roomId: party.chatRoom_id,
        nickname: user.nickname,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      console.log(position);
      chatService.onSend('/pub/party/position', position);

      const markerPosition = kakaoService.getLatLng(
        location.latitude,
        location.longitude
      );

      console.log(usersMarkers);
      const marker = kakaoService.getMapMarker(markerPosition, mainMap);
      preMarker && preMarker.setMap(null);
      setPreMarker(marker);
    }

    return () => {
      console.log('실기간 위치추적 종료');

      flag = false;
    };
  }, [location, party, mapSwitch, mainMap, connectFlag]);

  useEffect(() => {
    console.log(agreeAlert);
    if (mapSwitch) mainMap.relayout();
  }, [mapSwitch]);

  useEffect(() => {
    return () => {
      if (connectFlag) {
        console.log('연결0---------0종료');
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
