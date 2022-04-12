import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
import { Link, NavLink } from 'react-router-dom';
const Footer = (props) => (
  <footer>
    <nav>
      <ul className={styles.navbar}>
        <NavLink
          to='/'
          className={({ isActive }) => (isActive ? styles.test1 : styles.test2)}
        >
          <li className={styles.navbar__item}>asdf</li>
        </NavLink>
      </ul>
    </nav>
  </footer>
);

export default Footer;
