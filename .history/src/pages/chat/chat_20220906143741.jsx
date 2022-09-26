import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chat.module.css';

const Chat = ({}) => {
  //1 채팅 소켓 연결
  //2 채팅 내역 가져오기
  const { partyId } = useParams();
  const [inputText, setInputText] = useState();
  const submit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  const onChange = (e) => {
    const {
      target: { name, value, checked },
    } = e;

    switch (name) {
      case 'text':
        return setInputText(value);
    }
  };
  const click = (e) => {
    console.log(123);
  };
  useEffect(() => {
    console.log(partyId);
  });
  return (
    <section className={styles.container}>
      <div className={styles.content}></div>
      <form className={styles.inputBar}>
        <input
          name='text'
          value={inputText}
          type='text'
          className={styles.input__text}
        />
        <div type='button' onClick={click} className={styles.sendBtn}>
          전송
        </div>
      </form>
    </section>
  );
};

export default Chat;
