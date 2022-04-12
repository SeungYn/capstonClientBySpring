import React from 'react';
import styles from './partyList.module.css';
const PartyList = (props) => (
  <ul className={styles.partyContainer}>
    <li className={styles.partyItem}>
      <h3>나누리 파티</h3>
      <p>식당 : 나누리</p>
      <p>현재인원 : 1/4 | 18:43</p>
    </li>
  </ul>
);

export default PartyList;
