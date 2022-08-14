import React from 'react';
import styles from './myParty.module.css';
import { FaFemale } from 'react-icons/fa';
const MyParty = (props) => {
  return (
    <section className={styles.myParty__container}>
      <ul className={styles.myParty__peoples}>
        <li className={styles.myParty__peoples__people}>
          <div></div>
          <FaFemale fontSize='1px' />
        </li>
      </ul>
    </section>
  );
};

export default MyParty;
