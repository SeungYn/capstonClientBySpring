import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './MyInfo.module.css';

export default function MyInfo() {
  const { getMyInfo, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    getMyInfo()
      .then((data) => {
        setUserInfo((info) => data);
      })
      .catch(console.error);
  }, []);
  return <section className={styles.container}>f</section>;
}
