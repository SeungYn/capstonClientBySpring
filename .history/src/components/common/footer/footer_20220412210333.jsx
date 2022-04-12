import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
import { BsList, BsPerson } from 'react-icons/bs';
import { GrContactInfo, GrGroup } from 'react-icons/gr';
import { RiGroupLine } from 'react-icons/ri';
import { IoChatbubbleOutline } from 'react-icons/io5';

import { Link, NavLink } from 'react-router-dom';
const Footer = (props) => (
  <footer>
    <nav className={styles.nav}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <BiHomeAlt fontSize='2rem' />
          <span className={styles.navItem__text}>홈</span>
        </div>
      </NavLink>
      <NavLink
        to='/1'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <BsList fontSize='2rem' />
          <span className={styles.navItem__text}>모든 파티</span>
        </div>
      </NavLink>
      <NavLink
        to='/2'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <RiGroupLine fontSize='2rem' />
          <span className={styles.navItem__text}>내 파티</span>
        </div>
      </NavLink>
      <NavLink
        to='/3'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <IoChatbubbleOutline fontSize='2rem' />
          <span className={styles.navItem__text}>채팅</span>
        </div>
      </NavLink>
      <NavLink
        to='/4'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <BsPerson fontSize='2rem' />
          <span className={styles.navItem__text}>내 정보</span>
        </div>
      </NavLink>
    </nav>
  </footer>
);

export default Footer;
