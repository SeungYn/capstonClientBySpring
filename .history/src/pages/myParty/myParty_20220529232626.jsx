import React, { useState } from 'react';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = (props) => {
  const [peoples, setPeoples] = useState([
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201758110,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758020,
    },
    {
      sex: 'female',
      det: '컴퓨터공학부',
      sno: 201738010,
    },
    {
      sex: 'male',
      det: '컴퓨터공학부',
      sno: 201758010,
    },
  ]);

  return (
    <section className={styles.myParty__container}>
      <MyPartyItem peoples={peoples} />
    </section>
  );
};

export default MyParty;
