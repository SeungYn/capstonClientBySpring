import React, { useState } from 'react';
import styles from './myPartyItem.module.css';
import { FaFemale, FaMale } from 'react-icons/fa';
import { MdFemale, MdMale, MdEmojiPeople } from 'react-icons/md';
import { useCallback } from 'react';
import { memo } from 'react';
import { GiSiren } from 'react-icons/gi';
import { IconContext } from 'react-icons';
import { MdPersonOff } from 'react-icons/md';
const MyPartyItem = memo(
  ({ party, setClickedId, master, setKickAlertSwitch, user }) => {
    const {
      currentCount,
      matchingStatus,
      maximumCount,
      title,
      members,
      restaurantId,
      id,
    } = party;
    console.log(user);
    const blank = useCallback(
      (currentCount) => {
        let i = currentCount;
        const htmlCode = [];
        for (i; i < 8; i++) {
          htmlCode.push(
            <li key={i} className={`${styles.myParty__peoples__people} `}>
              <div className={styles.blank}>
                <IconContext.Provider value={{ size: '100px' }}>
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
            <div className={styles.contents} onClick={() => console.log(123)}>
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
            {user != item.id && (
              <div className={styles.BtnGroup}>
                {master && (
                  <button
                    onClick={() => {
                      setClickedId({ ...item });
                      setKickAlertSwitch(true);
                    }}
                    className={`${styles.Btn} ${styles.kickBtn}`}
                  >
                    <IconContext.Provider value={{ size: '1.8rem' }}>
                      <MdPersonOff />
                    </IconContext.Provider>
                  </button>
                )}
                <button
                  className={`${styles.Btn} ${styles.reportBtn}`}
                  onClick={() => {
                    setClickedId({ ...item });
                    setReportAlertSwitch(true);
                  }}
                >
                  <IconContext.Provider value={{ size: '1.8rem' }}>
                    <GiSiren />
                  </IconContext.Provider>
                </button>
              </div>
            )}
          </li>
        ))}
        {party && blank(currentCount)}
      </ul>
    );
  }
);

export default MyPartyItem;
