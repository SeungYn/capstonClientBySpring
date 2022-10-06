import React from 'react';
import styles from './reportContent.module.css';
import { reportDate } from '../../util/data';

const ReportContent = ({ setSwitch, reportContent }) => {
  return (
    <main className={styles.container}>
      <ul className={styles.reportList}>
        <h2 className={styles.title}>신고내역</h2>
        <li className={styles.reportList__header}>
          <h3
            className={`${styles.reportList__header__h} ${styles.reportList__first}`}
          >
            타입
          </h3>
          <h3
            className={`${styles.reportList__header__h} ${styles.reportList__second}`}
          >
            내용
          </h3>
          <h3
            className={`${styles.reportList__header__h} ${styles.reportList__third}`}
          >
            날짜
          </h3>
        </li>
        {reportContent &&
          reportContent.map((item) => (
            <li key={item.id} className={styles.reportList__item}>
              <p
                className={`${styles.reportList__item__p} ${styles.reportList__first}`}
              >
                {item.reportType}
              </p>
              <p
                className={`${styles.reportList__item__p} ${styles.reportList__second}`}
              >
                {item.description}
              </p>
              <p
                className={`${styles.reportList__item__p} ${styles.reportList__third}`}
              >
                {reportDate(item.reportedAt)}
              </p>
            </li>
          ))}
        <button className={styles.closeBtn}>확인</button>
      </ul>
    </main>
  );
};

export default ReportContent;
