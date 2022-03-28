import React from 'react';
import styles from './header.module.css';
const Header = ({ user, onLogout }) => {
  return (
    <header className={styles.headers}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.logo__title}>캡스톤</h2>
        </div>
        {user && (
          <nav className={styles.right}>
            <button>로그아웃</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
