import React, { memo } from 'react';
import styles from './mapAgreeAlert.module.css';

const KickAlert = ({ setSwitch, successCallback }) => {
  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2 className={styles.alert__header}>주의!</h2>
        <p className={styles.alert__text}>
          다른 사람의 위치를 지도에서 보려면 사용자의 위치도 공유해야 합니다.
        </p>

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.yesBtn}`}
            onClick={() => {
              setAgreeAlert(false);
              setAgree(true);
              setMapSwitch(true);
            }}
          >
            확인
          </button>
          <button
            className={`${styles.btn} ${styles.noBtn}`}
            onClick={() => {
              setAgreeAlert(false);
              setAgree(false);
              setMapSwitch(false);
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
