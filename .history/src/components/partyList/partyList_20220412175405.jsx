import React from 'react';
import styles from './partyList.module.css';
const PartyList = ({ partyList }) => (
  <ul className={styles.partyContainer}>
    {partyList.map((data) => {
      return (
        <li key={data.id} className={styles.partyItem}>
          <h3>{data.title}</h3>
          <p>식당 : {data.restaurantName}</p>
          <p>현재인원 : 1/4 | 18:43</p>
        </li>
      );
    })}
  </ul>
);

export default PartyList;
