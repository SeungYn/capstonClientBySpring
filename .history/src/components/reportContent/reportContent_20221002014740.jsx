import React from 'react';
import styles from './reportContent.module.css';
const ReportContent = ({ setSwitch, reportContent }) => {
  return (
    <main className={styles.container}>
      <ul className={styles.reportList}>
        {reportContent &&
          reportContent.map((item) => (
            <li key={item.id} className={styles.reportList__item}>
              <p className={reportList__item__p}>{item.reportType}</p>
              <p className={reportList__item__p}>{item.description}</p>
              <p className={reportList__item__p}>{item.reportedAt}</p>
            </li>
          ))}
      </ul>
    </main>
  );
};

export default ReportContent;
