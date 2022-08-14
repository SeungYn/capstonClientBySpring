import React from 'react';
import styles from './myPartyItem.module.css';
import { FaFemale, FaMale } from 'react-icons/fa';
const MyPartyItem = ({ peoples }) => (
  <ul className={styles.myParty__peoples}>
    {peoples.map((item) => (
      <li key={item.sno} className={styles.myParty__peoples__people}>
        {item.sex === 'female' ? (
          <FaFemale fontSize='2rem' />
        ) : (
          <FaMale fontSize='2rem' />
        )}
        <div className={styles.contents}>
          <span className={styles.contents__det}>{item.det}</span>
          <span className={styles.contents__sno}>{item.sno}</span>
        </div>
      </li>
    ))}
  </ul>
);

export default MyPartyItem;
