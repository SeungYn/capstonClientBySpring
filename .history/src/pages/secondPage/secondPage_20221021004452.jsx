import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
import PartyList from '../../components/partyList/partyList';
import { useAuth } from '../../context/AuthContext';
import styles from './secondPage.module.css';

export default function SecondPage({ partyService }) {
  const [parties, setParties] = useState([]);
  const [searchParties, setSearchParties] = useState([]);
  const userContext = useAuth();
  const navigation = useNavigate();
  const offset = useState({ all: 0, search: 0 });
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleJoin = (partyId, restaurantId) => {
    partyService
      .partyJoin(partyId, restaurantId)
      .then((party) => navigation('/myParty'))
      .catch((error) => {
        console.log(error);
        userContext.setError(error);
      }); //
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(1);
  };

  useEffect(() => {
    setLoading((l) => !l);
    partyService
      .getAllParties(0)
      .then((data) => {
        console.log(data);
        setParties([...data.parties]);
      })
      .catch(console.log)
      .finally(() => {
        setLoading((l) => !l);
      });

    return () => {
      console.log('두번째 페이지 종료');
    };
  }, [partyService]);
  if (loading) {
    return <LoadingSpin loading={loading} />;
  }

  return (
    <section className=''>
      <form onSubmit={handleSearch}>
        <input type='text' placeholder='파티 제목' />
        <button className=''>전송</button>
      </form>
      <section className=''>
        <PartyList partyList={parties} onJoinParty={handleJoin} />
      </section>
    </section>
  );
}
