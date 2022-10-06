import React, { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chat.module.css';
import { chatTime } from '../../util/data';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../../context/AuthContext';
const Chat = () => {
  const sockjs = new SockJS('http://192.168.148.119:8080/ws-stomp');

  const client = Stomp.over(sockjs);
  console.log(client.connected);
  // * overloads:
  // * - connect(headers, connectCallback)
  // * - connect(headers, connectCallback, errorCallback)

  const data = { roomId: 42, sender: '2', message: '반갑습니다.' };
  console.log(JSON.stringify(data));
  console.log(123);
  client.connect(
    {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    (successCallback) => {
      console.log('성공');
      console.log(successCallback + '성공');
      client.subscribe('/sub/chat/42', (cb) => {
        console.log('구독');
        console.log(cb, '123');
      });
      client.send(
        '/pub/party/message',
        {
          Authorization: `Bearer d${localStorage.getItem('token')}`,
        },
        JSON.stringify(data)
      );
      console.log(client.connected);
    },
    (errorCallback) => {
      console.log(errorCallback.command);
    }
  );
  return 'a';
};

// const Chat = ({ chatService }) => {
//   //1 채팅 소켓 연결
//   //2 채팅 내역 가져오기
//   const [inputText, setInputText] = useState('');
//   const [myName, setMyName] = useState('탈모왕유명수2');
//   const [chats, setChats] = useState([
//     {
//       chat_id: 1,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 2,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 3,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 4,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 5,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 6,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요2',
//       sender: '탈모왕유명수2',
//     },
//     {
//       chat_id: 7,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수2',
//     },
//     {
//       chat_id: 8,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요2',
//       sender: '탈모왕유명수2',
//     },
//     {
//       chat_id: 9,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//     {
//       chat_id: 10,
//       create_at: '2022-10-05 01:17:47',
//       message: '안녕하세요',
//       sender: '탈모왕유명수',
//     },
//   ]);
//   const [partyid, setPartyid] = useState();
//   const [party, setParty] = useState(undefined);
//   const { user, setError } = useAuth();
//   const submit = () => {};
//   //stomp 연결 플래그
//   const [connectFlag, setConnectFlag] = useState(false);
//   // const submit = useCallback((e) => {
//   //   e.preventDefault();
//   //   if (inputText == '') {
//   //     return;
//   //   }
//   //   chatService
//   //     .creatChat(partyId, inputText)
//   //     .then((data) => console.log('test'));
//   //   console.log('input test');
//   //   inputRef.current.focus();
//   //   setInputText('');
//   // });
//   const contentRef = useRef();
//   const inputRef = useRef();
//   const onChange = (e) => {
//     const {
//       target: { name, value, checked },
//     } = e;

//     switch (name) {
//       case 'text':
//         return setInputText(value);
//     }
//   };
//   const onCreated = (chat) => {
//     setChats((chats) => [...chats, chat]);
//     console.log('새로운', chat);
//     contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
//     return;
//   };

//   const stompChatSendToServer = (이벤트) => {
//     이벤트.preventDefault();
//     console.log(party.chatRoom_id);
//     chatService.onSend('/pub/party/message', {
//       roomId: party.chatRoom_id,
//       sender: '2',
//       message: '반갑습니다sssss.',
//     });
//   };

//   useEffect(() => {
//     chatService
//       .getMyParty()
//       .then((party) => {
//         console.log(party);
//         setParty(party);
//       })
//       .then(setError);

//     //연결상태 확인해서 connectFlag를 true로 해줌
//     if (chatService.connectState()) {
//       console.log('현재 서버와 연결된 상태입니다.');
//       setConnectFlag(true);
//       return;
//     }
//     chatService.onConnect(() => {
//       setConnectFlag(true);
//     });

//     return () => {};
//   }, [chatService]);

//   useEffect(() => {
//     //연결상태 확인해서 구독
//     console.log(connectFlag);
//     let subChat = () => {
//       console.log('chat 구독이 필요합니다');
//     };
//     if (connectFlag && party) {
//       subChat = chatService.onSubscribe(party.chatRoom_id, '/sub/char', (e) => {
//         console.log(e);
//         console.log('chat구독완료');
//       });
//       //stompChatSendToServer();
//     }
//     console.log('useEffect2');
//     return () => {
//       subChat();
//     };
//   }, [chatService, connectFlag, party]);

//   return (
//     <section className={styles.container}>
//       <div className={styles.content}>
//         {chats && (
//           //chat_id, create_at message, sender
//           <ul className={styles.chats} ref={contentRef}>
//             {chats.map((item, i) => {
//               console.log(item);
//               // if (item.sender === myName) {
//               //   return (
//               //     <li key={item.chat_id} className={styles.chats__mychat}>
//               //       {i == 0 && <p className={styles.nickname}>{item.user}</p>}
//               //       {i != 0 &&
//               //       chatTime(item.create_at) !=
//               //         chatTime(chats[i - 1].create_at) ? (
//               //         <p className={styles.nickname}>{item.sender}</p>
//               //       ) : (
//               //         item.sender !== chats[i - 1].sender && (
//               //           <p className={styles.nickname}>{item.sender}</p>
//               //         )
//               //       )}
//               //       <div className={styles.chats__content}>
//               //         <p className={styles.chats__time}>
//               //           {chatTime(item.create_at)}
//               //         </p>
//               //         <p className={styles.chats__chat}>{item.message}</p>
//               //       </div>
//               //       {/*
//               // 				시간이 같으면 닉네임 출력 x 전에 채팅 닉네임과 다르면 닉네임 출력
//               // 			*/}
//               //     </li>
//               //   );
//               // }
//               // return (
//               //   <li key={item.chat_id} className={styles.chats__otherchat}>
//               //     {i == 0 && <p className={styles.nickname}>{item.sender}</p>}
//               //     {i != 0 &&
//               //     chatTime(item.create_at) !=
//               //       chatTime(chats[i - 1].create_at) ? (
//               //       <p className={styles.nickname}>{item.sender}</p>
//               //     ) : (
//               //       item.sender !== chats[i - 1].sender && (
//               //         <p className={styles.nickname}>{item.sender}</p>
//               //       )
//               //     )}
//               //     <div className={styles.chats__content}>
//               //       <p className={styles.chats__chat}>{item.message}</p>
//               //       <p className={styles.chats__time}>
//               //         {chatTime(item.create_at)}
//               //       </p>
//               //     </div>
//               //   </li>
//               // );

//               return (
//                 <li>
//                   {i == 0 && <p className={styles.nickname}>{item.sender}</p>}
//                   {i != 0 &&
//                   chatTime(item.create_at) !=
//                     chatTime(chats[i - 1].create_at) ? (
//                     <p className={styles.nickname}>{item.sender}</p>
//                   ) : (
//                     <h1>{`${i}`}</h1>
//                   )}
//                   {i != 0 &&
//                     (true ? (
//                       <p className={styles.nickname}>{item.sender}</p>
//                     ) : (
//                       <h1>{`${i}`}</h1>
//                     ))}
//                   {i != 0 && <h2>{`두번째${i}`}</h2>}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//       <form className={styles.inputBar} onSubmit={stompChatSendToServer}>
//         <input
//           name='text'
//           value={inputText}
//           type='text'
//           className={styles.input__text}
//           ref={inputRef}
//           onChange={onChange}
//         />
//         <button className={styles.sendBtn}>전송</button>
//       </form>
//     </section>
//   );
// };

export default Chat;
