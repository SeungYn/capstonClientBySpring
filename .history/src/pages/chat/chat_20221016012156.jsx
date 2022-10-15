import React, { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chat.module.css';
import { chatTime } from '../../util/data';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../../context/AuthContext';
import { FaRegMap } from 'react-icons/fa';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import MapAgreeAlert from '../../components/mapAgreeAlert/mapAgreeAlert';
import { IconContext } from 'react-icons';

// const Chat = () => {
//   const sockjs = new SockJS('https://7b6f660509c8cd.lhr.life/ws-stomp');
//   // console.log(sockjs);

//   setTimeout(() => {
//     const client = Stomp.over(sockjs);
//     client.connect(
//       {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         reconnectDelay: 10000,
//       },
//       (c) => console.log(c)
//     );
//   }, 5000);

// const client2 = new StompJs.Client({
//   brokerURL: 'ws://54ca5e8f1ef8f4.lhr.life',
//   debug: (s) => console.log(s),
// });
// client2.onConnect = (f) => console.log(f);
// client2.activate();

// * overloads:
// * - connect(headers, connectCallback)
// * - connect(headers, connectCallback, errorCallback)

// const data = { roomId: 42, sender: '2', message: '반갑습니다.' };
// console.log(JSON.stringify(data));
// console.log(123);
// const position = {
//   romdId: 42,
//   nickName: '2',
//   latitude: 123.33,
//   longitude: 123.332,
// };

// client.connect(
//   {
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//   },
//   (successCallback) => {
//     console.log('성공');
//     console.log(successCallback + '성공');
//     client.subscribe('/sub/chat/42', (cb) => {
//       console.log('구독');
//       console.log(cb, '123');
//     });
//     client.subscribe('/sub/position/42', (cb) => {
//       console.log('구독');
//       console.log(cb, '123');
//     });
//     client.send(
//       '/pub/party/message',
//       {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       JSON.stringify(data)
//     );
//     client.send(
//       '/pub/party/message',
//       {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       JSON.stringify(data)
//     );
//     client.send(
//       '/pub/party/message',
//       {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       JSON.stringify(data)
//     );
//     client.send(
//       '/pub/party/position',
//       {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       JSON.stringify(position)
//     );
//     console.log(client.connected);
//   },
//   (error) => {
//     console.log(error);
//     console.log(error.command);
//   }
// );

//   return 'a';
// };

const Chat = ({ chatService, kakaoService }) => {
  //1 채팅 소켓 연결
  //2 채팅 내역 가져오기
  const [inputText, setInputText] = useState('');
  const [myName, setMyName] = useState('');
  const [chats, setChats] = useState([]);
  const [partyid, setPartyid] = useState();
  const [party, setParty] = useState(undefined);
  const { user, setError, userNickName } = useAuth();
  const { location, firstLocation, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const submit = () => {};
  //stomp 연결 플래그
  const [connectFlag, setConnectFlag] = useState(false);
  console.log('커넥트 플래그', connectFlag);
  console.log(1);
  //사용자 위치공유 동의
  const [agree, setAgree] = useState(false);
  const [agreeAlert, setAgreeAlert] = useState(false);
  const mapRef = useRef();
  const [mainMap, setMainMap] = useState('');
  const [preMarker, setPreMarker] = useState('');
  const [mapSwitch, setMapSwitch] = useState(false);
  const mapContainerRef = useRef();
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
          if (entries[0].isIntersecting && hasMore) {
            console.log('스크롤 끝부분');
          }
        },
        { threshold: 1.0 }
      );
    },
    [hasMore, offSet]
  );

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
    console.log(party.chatRoom_id);
    chatService.onSend('/pub/party/message', {
      roomId: party.chatRoom_id,
      sender: userNickName,
      message: inputText,
    });
    contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
    setInputText('');
  };

  const stompPosSendToServer = (e) => {
    e.preventDefault();
    const position = {
      roomId: 42,
      nickName: '2',
      latitude: 37.1926783,
      longitude: 127.0271609,
    };
    chatService.onSend('/pub/party/position', position);
  };

  //socket으로 닉네임이랑 위치를 받아옴
  const movePosition = useCallback(
    (posSocketData, flag) => {
      console.log(flag);
      if (!flag) {
        return;
      }
      console.log('movePosition');
      console.log(posSocketData);
      let { latitude, longitude, nickName } = posSocketData;
      nickName = nickName.toString();

      console.log(mainMap, 'mainMap');
      if (nickName != userNickName.toString()) {
        console.log(nickName, nickName == myName.toString());
        console.log(usersMarkers);
        //location이 있으면 usersMarkers에 저장
        if (latitude) {
          console.log('maker등록');
          const markerPosition = kakaoService.getLatLng(latitude, longitude);
          const marker = kakaoService.getMapMarker(
            markerPosition,
            mainMap,
            nickName
          );
          console.log(1);
          setUsersMarkers((markers) => {
            console.log(markers[nickName], 'set안에서 등록');
            console.log(markers);
            markers[nickName] && markers[nickName].setMap(null);
            return { ...markers, [nickName]: marker };
          });
        }
      }
    },
    [mainMap]
  );

  useEffect(() => {
    chatService
      .getMyParty()
      .then((party) => {
        console.log(party);
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
      chatService.onDisConnect();
      setConnectFlag(false);
      console.log('-------연결종료-------');
    };
  }, [chatService]);

  useEffect(() => {
    console.log('파티이펙트');
    if (party) {
      chatService
        .getChats(party.id, party.restaurantId)
        .then((data) => {
          setChats([...data.chats]);
          contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
          return;
        })
        .catch((e) => console.log(e));
    }
  }, [chatService, party]);
  console.log(123);
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

      //수정필요 사용자 동의해야 구독하도록 변경해야됨

      //stompChatSendToServer();
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

    return () => {
      subPosDisconnected();
      flag = false;
    };
  }, [chatService, connectFlag, party, agree, mainMap]);

  //지도와 실시간 위치
  useEffect(() => {
    if (!party || !agree || !firstLocation) {
      console.log(party, agree, firstLocation);
      console.log('취소');
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
  }, [chatService, party, agree, firstLocation]);

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
        nickName: userNickName,
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
                    item.sender.toString() === userNickName
                      ? styles.chats__mychat
                      : styles.chats__otherchat
                  }
                >
                  {i == 0 && <p className={styles.nickname}>{item.sender}</p>}
                  {i != 0 &&
                    (chatTime(item.sendTime) !=
                    chatTime(chats[i - 1].sendTime) ? (
                      <p className={styles.nickname}>{item.sender}</p>
                    ) : (
                      item.sender !== chats[i - 1].sender && (
                        <p className={styles.nickname}>{item.sender}</p>
                      )
                    ))}
                  <div
                    className={`${styles.chats__content} ${
                      item.sender.toString() !== userNickName &&
                      styles.chats__otherChat
                    }`}
                  >
                    <p className={styles.chats__time}>
                      {chatTime(item.sendTime)}
                    </p>
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
            color: 'green',
            size: '3rem',
            style: { cursor: 'pointer' },
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
