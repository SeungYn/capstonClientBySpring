import React, { useState } from 'react';
import styles from './secondPage.module.css';

export default function secondPage() {
  const [parties, setParties] = useState({});
  return (
    <section className=''>
      <form>
        <input type='text' placeholder='파티 제목' />
        <button className=''>전송</button>
      </form>
      <section className=''></section>
    </section>
  );
}
