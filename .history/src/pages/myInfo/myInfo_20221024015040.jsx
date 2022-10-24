import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './MyInfo.module.css';
export default function MyInfo() {
  const { getMyInfo } = useAuth();
  useEffect(() => {
    getMyInfo().then((data) => {
      console.log(data);
    });
  }, []);
  return <main>f</main>;
}
