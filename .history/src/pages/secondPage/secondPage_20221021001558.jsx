import React, { useState } from 'react';
import PartyList from '../../components/partyList/partyList';
import styles from './secondPage.module.css';

export default function SecondPage() {
  const [parties, setParties] = useState([
    {
      id: 774,
      title: '점심에 도스마스 같이 갈 사람 구함',
      restaurant: '팬도로시 한신대학교점',
      createdAt: '2022-10-19T02:17:42.997708',
      status: 'NON_MATCHED',
      maximumCount: 4,
      currentCount: 1,
    },
    {
      id: 772,
      title: '점심에 도스마스 같이 갈 사람 구함',
      restaurant: '그라찌에 한신대경삼관점',
      createdAt: '2022-10-19T02:07:02.605527',
      status: 'NON_MATCHED',
      maximumCount: 4,
      currentCount: 1,
    },
    {
      id: 43,
      title: '123',
      restaurant: '우리반점',
      createdAt: '2022-10-03T02:17:52.987875',
      status: 'NON_MATCHED',
      maximumCount: 4,
      currentCount: 2,
    },
  ]);

  return (
    <section className=''>
      <form>
        <input type='text' placeholder='파티 제목' />
        <button className=''>전송</button>
      </form>
      <section className=''>
        <PartyList partyList={parties} />
      </section>
    </section>
  );
}
