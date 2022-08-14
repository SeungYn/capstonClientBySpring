import React, { useState } from 'react';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = (props) => {
  const [peoples, setPeoples] = useState([{ sex: 'female' }]);

  return (
    <section className={styles.myParty__container}>
      <MyPartyItem />
    </section>
  );
};

export default MyParty;
