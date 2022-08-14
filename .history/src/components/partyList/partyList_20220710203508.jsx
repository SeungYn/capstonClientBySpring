import React from 'react';
import styles from './partyList.module.css';
const PartyList = ({ partyList }) => {
  return (
    <ul className={styles.partyContainer}>
      {/* {partyList.map((data) => {
        console.log(data, '123');
        return (
          <li key={data.id} className={styles.partyItem}>
            <h3>{data.title}</h3>
            <p>식당 : {data.restaurant}</p>
            <p>
              현재인원 : {data.currentCount}/{data.maximumCount} |{' '}
              {data.createdAt} | {`매칭상태 : ${data.status}`}
            </p>
          </li>
        );
      })} */}
      <li key={1} className={styles.partyItem}>
        <h3>{123}</h3>
        <p>식당 : {123}</p>
        <p>현재인원 : 123/123 | 123 | {`매칭상태 : 123`}</p>
      </li>
    </ul>
  );
};

export default PartyList;
