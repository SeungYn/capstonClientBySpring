import React from 'react';
import styles from './myPartyItem.module.css';
import { FaFemale } from 'react-icons/fa';
const MyPartyItem = (props) => (
  <ul className={styles.myParty__peoples}>
    <li className={styles.myParty__peoples__people}>
      <FaFemale fontSize='10px' />
    </li>
  </ul>
);

export default MyPartyItem;
