import React, { useState } from 'react';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = (props) => {
  const [peoples, setPeoples] = useState([
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201758110,
      nickName: 'aaa',
      reliability: 0,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758020,
      nickName: 'aaa',
      reliability: 0,
    },
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201738010,
      nickName: 'aaa',
      reliability: 0,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758010,
      nickName: 'aaa',
      reliability: 0,
    },
  ]);

  return (
    <section className={styles.myParty__container}>
      <MyPartyItem peoples={peoples} />
      <div className={styles.btn__group}></div>
    </section>
  );
};

export default MyParty;
