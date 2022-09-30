import React, { memo } from 'react';
import styles from './reportModal.module.css';

const ReportModal = ({
  party,
  setSwitch,
  clickedMember,
  setClickMember,
  onReport,
}) => {
  const [reportType, setReportType] = useState([{id:1}, {id:2})
  console.log(party);
  console.log(clickedMember);
  return (
    <main className={styles.container}>
      <section className={styles.alert__container}>
        <h2
          className={styles.alert__header}
        >{`신고대상 : ${clickedMember.nickName}`}</h2>

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.yesBtn}`}
            onClick={() => {
              //onKick(party.restaurantId, party.id, clickedMember.id);
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

export default ReportModal;
