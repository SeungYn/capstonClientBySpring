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

  return <section className={styles.container}>1</section>;
}
