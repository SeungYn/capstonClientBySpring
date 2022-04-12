import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
import { Link, NavLink } from 'react-router-dom';
const Footer = (props) => (
  <footer>
    <nav>
      <NavLink
        to='/'
        className={({ isActive }) => (isActive ? styles.test1 : styles.test2)}
      >
        asd
        <BiHomeAlt fontSize='1.5rem' />
      </NavLink>
    </nav>
  </footer>
);

export default Footer;
