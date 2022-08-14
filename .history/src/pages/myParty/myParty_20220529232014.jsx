import React, { useState } from 'react';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = (props) => {
  const [peoples, setPeoples] = useState([
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201758010,
    },
  ]);

  return (
    <section className={styles.myParty__container}>
      <MyPartyItem />
    </section>
  );
};

export default MyParty;
