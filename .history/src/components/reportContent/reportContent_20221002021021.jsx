import React from 'react';
import styles from './reportContent.module.css';
import { reportDate } from '../../util/data';

const ReportContent = ({ setSwitch, reportContent }) => {
  return (
    <main className={styles.container}>
      <ul className={styles.reportList}>
        <li className={styles.reportList__header}>
          <h2 className={`${styles.reportList__header__h}`}>타입</h2>
          <h2 className={`${styles.reportList__header__h}`}>내용</h2>
          <h2 className={`${styles.reportList__header__h}`}>날짜</h2>
        </li>
        {reportContent &&
          reportContent.map((item) => (
            <li key={item.id} className={styles.reportList__item}>
              <p className={`${styles.reportList__item__p}`}>
                {item.reportType}
              </p>
              <p className={`${styles.reportList__item__p}`}>
                {item.description}
              </p>
              <p className={`${styles.reportList__item__p}`}>
                {reportDate(item.reportedAt)}
              </p>
            </li>
          ))}
      </ul>
    </main>
  );
};

export default ReportContent;
