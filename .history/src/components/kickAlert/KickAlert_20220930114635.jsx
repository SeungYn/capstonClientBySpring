import React, { memo } from 'react';
import styles from './kickAlert.module.css';

const KickAlert = ({
  setSwitch,
  clickedMember,
  setClickedMember,
  successCallback,
}) => {
  const onSuccess = () => {};

  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2 className={styles.alert__header}>주의!</h2>
        <p className={styles.alert__text}>{clickedMember}</p>

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
              setSwitch(false);
              console.log(1);
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
