import React from 'react';
import styles from './loadingSpin.module.css';

const LoadingSpin = ({ loading }) => (
  <div
    className={`${styles.container} ${
      loading ? styles.loading_on : styles.loading_off
    }`}
  >
    <div className={styles.loading}></div>
    <p className={styles.loading_content}>현황 업데이트중</p>
  </div>
);

export default LoadingSpin;
