import React from 'react';
import styles from './reportContent.module.css';
import { reportDate } from '../../util/data';

const ReportContent = ({ setSwitch, reportContent }) => {
  return (
    <main className={styles.container}>
      <ul className={styles.reportList}>
        {reportContent &&
          reportContent.map((item) => (
            <li key={item.id} className={styles.reportList__item}>
              <p className={styles.reportList__item__p}>{item.reportType}</p>
              <p className={styles.reportList__item__p}>{item.description}</p>
              <p className={styles.reportList__item__p}>
                {reportDate(item.reportedAt)}
              </p>
            </li>
          ))}
      </ul>
    </main>
  );
};

export default ReportContent;
