import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
const Footer = (props) => (
  <footer>
    <nav>
      <ul className={styles.navbar}>
        <Link to='/'>
          <li className={styles.navbar__item}>asdf</li>
        </Link>
      </ul>
    </nav>
  </footer>
);

export default Footer;
