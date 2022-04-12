import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
const Footer = (props) => (
  <footer>
    <nav>
      <ul className={styles.navbar}>
        <li className={styles.navbar__item}></li>
      </ul>
      <div>asd</div>
      <BiHomeAlt color='blue' />
    </nav>
  </footer>
);

export default Footer;
