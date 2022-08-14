import React from 'react';
import styles from './myParty.module.css';

const MyParty = (props) => {
  return (
    <section className={styles.myParty__container}>
      <ul className={styles.myParty__peoples}>
        <li className={styles.myParty__peoples__people}>
          <div></div>
          <FaFemale fontSize='10px' />
        </li>
      </ul>
    </section>
  );
};

export default MyParty;
