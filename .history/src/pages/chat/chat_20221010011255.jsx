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
//   const sockjs = new SockJS('https://099b41a651ca18.lhr.life/ws-stomp');

//   const client = Stomp.over(sockjs);
//   console.log(client.connected);
//   // * overloads:
//   // * - connect(headers, connectCallback)
//   // * - connect(headers, connectCallback, errorCallback)

//   const data = { roomId: 42, sender: '2', message: '반갑습니다.' };
//   console.log(JSON.stringify(data));
//   console.log(123);
//   const position = {
//     romdId: 42,
//     nickName: '2',
//     latitude: 123.33,
//     longitude: 123.332,
//   };
//   client.connect(
//     {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//     (successCallback) => {
//       console.log('성공');
//       console.log(successCallback + '성공');
//       client.subscribe('/sub/chat/42', (cb) => {
//         console.log('구독');
//         console.log(cb, '123');
//       });
//       client.subscribe('/sub/position/42', (cb) => {
//         console.log('구독');
//         console.log(cb, '123');
//       });
//       client.send(
//         '/pub/party/message',
//         {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         JSON.stringify(data)
//       );
//       client.send(
//         '/pub/party/message',
//         {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         JSON.stringify(data)
//       );
//       client.send(
//         '/pub/party/message',
//         {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         JSON.stringify(data)
//       );
//       client.send(
//         '/pub/party/position',
//         {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         JSON.stringify(position)
//       );
//       console.log(client.connected);
//     },
//     (error) => {
//       console.log(error);
//       console.log(error.command);
//     }
//   );
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
      romdId: 42,
      nickName: '2',
      latitude: 123.33,
      longitude: 123.332,
    };
    chatService.onSend('/pub/party/position', position);
  };

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
      console.log('현재 서버와 연결된 상태입니다.');
      setConnectFlag(true);
      return;
    }
    chatService.onConnect(() => {
      setConnectFlag(true);
    });

    return () => {};
  }, [chatService]);

  useEffect(() => {
    if (party) {
      console.log('zhzhzhzhzhzzhh');
      console.log(party);
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

  useEffect(() => {
    //연결상태 확인해서 구독
    console.log(connectFlag);
    let subChatDisconnected = () => {
      console.log('chat 구독이 필요합니다');
    };
    let subPosDisconnected = () => {
      console.log('pos 구독이 필요합니다');
    };
    if (connectFlag && party) {
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
      subPosDisconnected = chatService.onSubscribe(
        party.chatRoom_id,
        '/sub/position/',
        (e) => {
          const chat = JSON.parse(e.body);
          console.log(e);
          console.log('받은 좌표', e.body);
        }
      );
      //stompChatSendToServer();
    }
    console.log('useEffect2');
    return () => {
      subChatDisconnected();
    };
  }, [chatService, connectFlag, party]);

  //지도와 실시간 위치
  useEffect(() => {}, [chatService, connectFlag, party]);
  return (
    <section className={styles.container}>
      {agreeAlert && (
        <MapAgreeAlert
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
      <div className={styles.content}>
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
      <form className={styles.inputBar} onSubmit={stompPosSendToServer}>
        <IconContext.Provider
          value={{
            color: 'green',
            size: '3rem',
            style: { cursor: 'pointer' },
          }}
        >
          <FaRegMap
            onClick={useCallback(() => {
              setAgreeAlert(true);
            }, [])}
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
