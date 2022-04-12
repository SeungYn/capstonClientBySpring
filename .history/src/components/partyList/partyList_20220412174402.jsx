import React from 'react';

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
