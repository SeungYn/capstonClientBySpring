import React, { useEffect } from 'react';
import { useState } from 'react';
import Error from '../../components/error/error';
import { useAuth } from '../../context/AuthContext';
import styles from './MyInfo.module.css';

export default function MyInfo() {
  const { getMyInfo, logout, error, setError } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getMyInfo()
      .then((data) => {
        setUserInfo((info) => data);
      })
      .catch(console.error);
  }, []);
  console.log(userInfo);

  return (
    <section className={styles.container}>
      {userInfo && (
        <div className={styles.info}>
          <h2>내 정보</h2>
          <p>{`닉네임 : ${userInfo.nickname}`}</p>
          <p>{`학교 : ${userInfo.university}`}</p>
          <p>{`학과 : ${userInfo.dept}`}</p>
          <p>{`학번 : ${userInfo.sno}`}</p>
        </div>
      )}
      <button className={styles.logout} onClick={() => logout()}>
        로그아웃
      </button>
    </section>
  );
}
