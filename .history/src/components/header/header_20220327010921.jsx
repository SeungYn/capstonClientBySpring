import React from 'react';
import styles from './header.module.css';
const Header = (props) => {
  return (
    <header className={styles.headers}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.logo__title}></h2>
        </div>
        <div className={styles.right}></div>
      </div>
    </header>
  );
};

export default Header;
