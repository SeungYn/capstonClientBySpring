import React, { memo, useEffect } from 'react';
import styles from './mapAgreeAlert.module.css';

const MapAgreeAlert = ({ agree, setAgree, setAgreeAlert, setMapSwitch }) => {
  useEffect(() => {
    //사용자가 한번 동의하면 새로고침하기 전까지 지도클릭시 바로 보이도록 함
    if (agree) {
      setAgreeAlert(false);
      return setMapSwitch(true);
    }
  }, [agree]);
  if (agree) {
    return;
  }
  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2 className={styles.alert__header}>주의!</h2>
        <p className={styles.alert__text}>
          다른 사람의 위치를 지도에서 보려면 사용자의 위치도 공유해야 합니다.
        </p>
        {/* <p className={styles.alert__trick}>
          (5000원을 결제하시면 사용자의 위치공유 없이 다른 사람의 위치를 볼 수
          있습니다.)
        </p> */}

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

export default MapAgreeAlert;
