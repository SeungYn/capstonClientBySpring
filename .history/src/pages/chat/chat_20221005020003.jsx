import React, { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chat.module.css';
import { chatTime } from '../../util/data';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../../context/AuthContext';
// const Chat = () => {
//   const sockjs = new SockJS('https://9bbfc7f0dc2cae.lhr.life/ws-stomp');

//   const client = Stomp.over(sockjs);
//   console.log(client.connected);
//   // * overloads:
//   // * - connect(headers, connectCallback)
//   // * - connect(headers, connectCallback, errorCallback)

//   const data = { roomId: 42, sender: '2', message: '반갑습니다.' };
//   console.log(JSON.stringify(data));
//   console.log(123);
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
//       client.send(
//         '/pub/party/message',
//         { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         JSON.stringify(data)
//       );
//       console.log(client.connected);
//     },
//     (errorCallback) => {
//       console.log(errorCallback);
//     }
//   );
//   return 'a';
// };

const Chat = ({ chatService }) => {
  //1 채팅 소켓 연결
  //2 채팅 내역 가져오기
  const [inputText, setInputText] = useState('');
  const [myName, setMyName] = useState();
  const [chats, setChats] = useState();
  const [partyid, setPartyid] = useState();
  const [party, setParty] = useState(undefined);
  const { user, setError } = useAuth();
  const submit = () => {};
  //stomp 연결 플래그
  const [connectFlag, setConnectFlag] = useState(false);
  // const submit = useCallback((e) => {
  //   e.preventDefault();
  //   if (inputText == '') {
  //     return;
  //   }
  //   chatService
  //     .creatChat(partyId, inputText)
  //     .then((data) => console.log('test'));
  //   console.log('input test');
  //   inputRef.current.focus();
  //   setInputText('');
  // });
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
    chatService.onSend('/pub/party/message', {
      roomId: 42,
      sender: '2',
      message: '반갑습니다.',
    });
  };

  useEffect(() => {
    chatService
      .getMyParty()
      .then((item) => console.log(item))
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
    //연결상태 확인해서 구독
    console.log(connectFlag);
    let subChat = () => {
      console.log('chat 구독이 필요합니다');
    };
    if (connectFlag) {
      subChat = chatService.onSubscribe('42', '/sub/char', () => {
        console.log('chat구독완료');
      });
      //stompChatSendToServer();
    }
    console.log('useEffect2');
    return () => {
      subChat();
    };
  }, [chatService, connectFlag]);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {chats && (
          <ul className={styles.chats} ref={contentRef}>
            {chats.map((item, i) => {
              if (item.user === myName) {
                return (
                  <li key={item.id} className={styles.chats__mychat}>
                    {i == 0 && <p className={styles.nickname}>{item.user}</p>}
                    {i != 0 &&
                      chatTime(item.createdAt) !=
                        chatTime(chats[i - 1].createdAt) &&
                      item.user !== chats[i - 1].user && (
                        <p className={styles.nickname}>{item.user}</p>
                      )}
                    <div className={styles.chats__content}>
                      <p className={styles.chats__time}>
                        {chatTime(item.createdAt)}
                      </p>
                      <p className={styles.chats__chat}>{item.chat}</p>
                    </div>
                    {/*
											시간이 같으면 닉네임 출력 x 전에 채팅 닉네임과 다르면 닉네임 출력
										*/}
                  </li>
                );
              }
              return (
                <li key={item.id} className={styles.chats__otherchat}>
                  {i == 0 && <p className={styles.nickname}>{item.user}</p>}
                  {i != 0 &&
                    chatTime(item.createdAt) !=
                      chatTime(chats[i - 1].createdAt) &&
                    item.user !== chats[i - 1].user && (
                      <p className={styles.nickname}>{item.user}</p>
                    )}
                  <div className={styles.chats__content}>
                    <p className={styles.chats__chat}>{item.chat}</p>
                    <p className={styles.chats__time}>
                      {chatTime(item.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form className={styles.inputBar} onSubmit={stompChatSendToServer}>
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
