import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = ({ partyService }) => {
  const [peoples, setPeoples] = useState([
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201758110,
      nickName: 'aaa',
      reliability: 0,
      status: 0,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758020,
      nickName: 'aaa',
      reliability: 0,
      status: 1,
    },
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201738010,
      nickName: 'aaa',
      reliability: 0,
      status: 0,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758010,
      nickName: 'aaa',
      reliability: 0,
      status: 1,
    },
  ]);
  const [party, setParty] = useState({});
  //파티 멤버수가 바뀌면 업데이트
  const [memberCount, setMemberCount] = useState('');


  const onReady = () => {
    console.log('ready');
  };

  useEffect(() => {
    partyService
      .getMyParty() //
      .then((data) => setParty({ party: data }));
  }, [party);

  return (
    <section className={styles.myParty__container}>
      <MyPartyItem peoples={peoples} onReady={onReady} />

      <div className={styles.btnGroup}>
        <button className={styles.btnGroup__btn} onClick={onReady}>
          준비하기
        </button>
        <div className={styles.btnGroup__right}>
          <button className={styles.btnGroup__btn}>채팅하기</button>
          <button className={styles.btnGroup__btn}>나가기</button>
        </div>
      </div>
    </section>
  );
};

export default MyParty;