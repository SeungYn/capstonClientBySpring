import React, { memo } from 'react';
import { parseDate } from '../../util/data';
import styles from './partyList.module.css';
const PartyList = memo(({ partyList,partyType, onJoinParty, lastListElement }) => {
  console.log('PartyList.jsx');

  return (
    <ul className={styles.partyContainer}>
      {partyList.map((data, index) => {
        return (
          <li
            key={data.id}
            className={styles.partyItem}
            onClick={() => onJoinParty(data.id, data.restaurantId)}
            ref={
              index === partyList.length - 1
                ? lastListElement && lastListElement
                : null
            }
            data-partytype={}
          >
            <h3>{data.title}</h3>
            <p>식당 : {data.restaurant}</p>
            <p>
              현재인원 : {data.currentCount}/{data.maximumCount} |{' '}
              {`생성 시간 : ${parseDate(data.createdAt)}`} |{' '}
              {`매칭상태 : ${data.status}`}
            </p>
          </li>
        );
      })}
    </ul>
  );
});

export default PartyList;
