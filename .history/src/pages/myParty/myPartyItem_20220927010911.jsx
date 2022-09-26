import React, { useState } from 'react';
import styles from './myPartyItem.module.css';
import { FaFemale, FaMale } from 'react-icons/fa';
import { MdFemale, MdMale, MdEmojiPeople } from 'react-icons/md';
import { useCallback } from 'react';
import { memo } from 'react';
import { GiSiren } from 'react-icons/gi';
import { IconContext } from 'react-icons';
import { MdPersonOff } from 'react-icons/md';
const MyPartyItem = memo(({ party, onKick, master }) => {
  const {
    currentCount,
    matchingStatus,
    maximumCount,
    title,
    members,
    restaurantId,
    id,
  } = party;

  const blank = useCallback(
    (currentCount) => {
      let i = currentCount;
      const htmlCode = [];
      for (i; i < 8; i++) {
        htmlCode.push(
          <li key={i} className={`${styles.myParty__peoples__people} `}>
            <div className={styles.blank}>
              <IconContext.Provider>
                <MdEmojiPeople />
              </IconContext.Provider>
            </div>
          </li>
        );
      }

      return htmlCode;
    },
    [party]
  );

  return (
    <ul className={styles.myParty__peoples__grid}>
      {members.map((item) => (
        <li key={item.nickName} className={styles.myParty__peoples__people}>
          <div
            className={
              item.owner
                ? styles.readyOn
                : item.ready == 1
                ? styles.readyOn
                : styles.readyOff
            }
          >
            {item.owner ? '방장' : '준비'}
          </div>
          <div className={styles.contents}>
            <span className={styles.contents__det}>학과 : {item.dept}</span>
            <span className={styles.contents__sno}>학번 : {item.sno}</span>
            <span className={styles.contents__nickName}>
              닉네임 : {item.nickName}{' '}
              {item.sex == 'MALE' ? (
                <span className={styles.male}>
                  <MdMale />
                </span>
              ) : (
                <span className={styles.female}>
                  <MdFemale />
                </span>
              )}
            </span>
            <span className={styles.contents__reliability}>
              신뢰도 : {item.reliability}
            </span>
          </div>
          <div className={styles.BtnGroup}>
            {master && (
              <button className={`${styles.Btn} ${styles.kickBtn}`}>
                <p>강퇴하기</p>
              </button>
            )}
            <button className={`${styles.Btn} ${styles.reportBtn}`}>
              <IconContext.Provider>
                <GiSiren />
              </IconContext.Provider>
            </button>
          </div>
        </li>
      ))}
      {party && blank(currentCount)}
    </ul>
  );
});

export default MyPartyItem;
