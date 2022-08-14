import React from 'react';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';

const MyParty = (props) => {
  return (
    <section className={styles.myParty__container}>
      <MyPartyItem />
    </section>
  );
};

export default MyParty;
