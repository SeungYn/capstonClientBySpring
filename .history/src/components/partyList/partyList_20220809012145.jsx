import React from 'react';
import styles from './partyList.module.css';
const PartyList = ({ partyList }) => {
  return (
    <ul className={styles.partyContainer}>
      {partyList.map((data) => {
        console.log(data, '123');
      })}
    </ul>
  );
};

export default PartyList;
