import React, { memo } from 'react';
import styles from './kickAlert.module.css';

const KickAlert = ({
  party,
  setSwitch,
  clickedMember,
  setClickedMember,
  successCallback,
}) => {
  console.log(party);
  console.log(clickedMember);
  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2
          className={styles.alert__header}
        >{`정말로 ${clickedMember.nickName}님을 강퇴하시겠습니까?`}</h2>

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.yesBtn}`}
            onClick={() => {
              console.log(1);
            }}
          >
            확인
          </button>
          <button
            className={`${styles.btn} ${styles.noBtn}`}
            onClick={() => {
              setClickedMember({});
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
