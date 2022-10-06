import React from 'react';
import styles from './reportContent.module.css';
const ReportContent = ({ setSwitch, reportContent }) => {
  return (
    <main className={styles.container}>
      <ul className={styles.reportList}>
        {reportContent &&
          reportContent.map((item) => <li key={item.id}>{item.reportType}</li>)}
      </ul>
    </main>
  );
};

export default ReportContent;
