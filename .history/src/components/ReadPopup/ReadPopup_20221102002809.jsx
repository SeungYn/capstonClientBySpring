import React from 'react';
import styles from './ReadPopup.module.css';

/**
 * 팝업은 이런형식으로
 * {message , }
 * @returns
 */
export default function ReadPopup({ content, onHandler, type }) {
  console.log(type);
  console.log(content.message);
  return (
    <div className={styles.container}>
      <div className={styles.error__form}>
        <p className={styles.text}>
          {/* {type === 'error' ? content.message : content} */}
          {content.message || content}
        </p>
        <button className={styles.btn} onClick={() => onHandler()}>
          확인
        </button>
      </div>
    </div>
  );
}
