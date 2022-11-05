import React, { memo } from 'react';
import styles from './kickAlert.module.css';

const KickAlert = ({
  party,
  setSwitch,
  clickedMember,
  setClickMember,
  onKick,
}) => {
  console.log(party);
  console.log(clickedMember);
  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2
          className={styles.alert__header}
        >{`정말로 ${clickedMember.nickname}님을 강퇴하시겠습니까?`}</h2>

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.yesBtn}`}
            onClick={() => {
              onKick(party.restaurantId, party.id, clickedMember.id);
              setClickMember({});
              setSwitch(false);
            }}
          >
            확인
          </button>
          <button
            className={`${styles.btn} ${styles.noBtn}`}
            onClick={() => {
              setClickMember({});
              setSwitch(false);
            }}
          >
            취소
          </button>
        </div>
      </section>
    </main>
  );
};

export default KickAlert;
