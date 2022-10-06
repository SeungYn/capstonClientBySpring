import React, { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chat.module.css';
import { chatTime } from '../../util/data';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
const Chat = () => {
  const sockjs = new SockJS('https://ed6e4aceeea335.lhr.life/ws-stomp');

  const client = Stomp.over(sockjs);
  console.log(
    JSON.stringify({
      message: {
        roomId: 34,
        sender: '2',
        message: '반갑습니다.',
      },
    })
  );
  client.connect(
    {
      debug: (e) => console.log(e),

      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    (successCallback) => {
      console.log(successCallback);
      client.subscribe('/sub/chat/34', (cb) => {
        console.log(cb.body, '123');
        client.send(
          '/pub/party/message',
          {},
          JSON.stringify({
            message: {
              roomId: 34,
              sender: '2',
              message: '반갑습니다.',
            },
          })
        );
      });
    },
    (errorCallback) => {
      console.log(errorCallback);
    }
  );

  return 'a';
};
// const Chat = ({ chatService }) => {
//   //1 채팅 소켓 연결
//   //2 채팅 내역 가져오기
//   const { partyId } = useParams();
//   const [inputText, setInputText] = useState('');
//   const [myName, setMyName] = useState();
//   const [chats, setChats] = useState();
//   const [partyid, setPartyid] = useState();
//   const submit = useCallback((e) => {
//     e.preventDefault();
//     if (inputText == '') {
//       return;
//     }
//     chatService
//       .creatChat(partyId, inputText)
//       .then((data) => console.log('test'));
//     console.log('input test');
//     inputRef.current.focus();
//     setInputText('');
//   });
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

//   useEffect(() => {
//     const disConnect = chatService.onConnectChat(partyId);
//     chatService.getMyInfo().then((data) => {
//       setPartyid(data.partyId);
//       return setMyName(data.nickname);
//     });
//     // if (partyId) {
//     //   disConnect = chatService.onConnectChat(partyId);
//     // } else {
//     //   console.log('a', partyid);
//     //   disConnect = chatService.onConnectChat(partyid);
//     // }

//     chatService.getChats(partyId).then((data) => {
//       console.log(data);
//       setChats([...data]);

//       return;
//     });

//     console.log(disConnect);
//     //contentRef.current.scrollIntoView({ block: 'end', inline: 'end' });
//     const chatSync = chatService.onChatSync('chat', (data) => {
//       console.log('emitchat');
//       return onCreated(data);
//     });
//     const inSync = chatService.onChatSync('join', (data) => console.log(data));

//     const exitSync = chatService.onChatSync('exit', (data) =>
//       console.log(data)
//     );

//     return () => {
//       //종료 순서 중요 이벤트들 부터 먼저 제거 후 연결 끊기
//       chatSync();
//       inSync();
//       exitSync();
//       disConnect();
//     };
//   }, [chatService]);
//   return (
//     <section className={styles.container}>
//       <div className={styles.content}>
//         {chats && (
//           <ul className={styles.chats} ref={contentRef}>
//             {chats.map((item, i) => {
//               if (item.user === myName) {
//                 return (
//                   <li key={item.id} className={styles.chats__mychat}>
//                     {i == 0 && <p className={styles.nickname}>{item.user}</p>}
//                     {i != 0 &&
//                       chatTime(item.createdAt) !=
//                         chatTime(chats[i - 1].createdAt) &&
//                       item.user !== chats[i - 1].user && (
//                         <p className={styles.nickname}>{item.user}</p>
//                       )}
//                     <div className={styles.chats__content}>
//                       <p className={styles.chats__time}>
//                         {chatTime(item.createdAt)}
//                       </p>
//                       <p className={styles.chats__chat}>{item.chat}</p>
//                     </div>
//                     {/*
// 											시간이 같으면 닉네임 출력 x 전에 채팅 닉네임과 다르면 닉네임 출력
// 										*/}
//                   </li>
//                 );
//               }
//               return (
//                 <li key={item.id} className={styles.chats__otherchat}>
//                   {i == 0 && <p className={styles.nickname}>{item.user}</p>}
//                   {i != 0 &&
//                     chatTime(item.createdAt) !=
//                       chatTime(chats[i - 1].createdAt) &&
//                     item.user !== chats[i - 1].user && (
//                       <p className={styles.nickname}>{item.user}</p>
//                     )}
//                   <div className={styles.chats__content}>
//                     <p className={styles.chats__chat}>{item.chat}</p>
//                     <p className={styles.chats__time}>
//                       {chatTime(item.createdAt)}
//                     </p>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//       <form className={styles.inputBar} onSubmit={submit}>
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
