import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    partyService
      .getAllParties(0)
      .then((data) => {
        setParties([...data.parties]);
      })
      .then(console.log);
  }, [partyService]);

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
