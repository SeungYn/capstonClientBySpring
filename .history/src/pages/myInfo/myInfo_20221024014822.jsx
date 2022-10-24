import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './MyInfo.module.css';
export default function MyInfo() {
  const authContext = useAuth();
  console.log(await authContext.getMyInfo());
  return <main>f</main>;
}
