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

  const handlerChange = (e) => {
    const input = e.target.value;
    console.log(input);
    setSearchKeyword(input);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    partyService
      .searchParties(offset.search, searchKeyword)
      .then((data) => {
        setSearchParties([...data.parties]);
      })
      .catch(console.log)
      .finally(() => {
        console.log('finally');
      });
  };

  useEffect(() => {
    if (searchKeyword === '') return;
    console.log('keyword');
    console.log(searchParties);
    console.log(searchKeyword);
    // const setTime = setTimeout(() => {
    //   partyService
    //     .searchParties(offset.search, searchKeyword)
    //     .then((data) => {
    //       setSearchParties([...data.parties]);
    //     })
    //     .catch(console.log)
    //     .finally(() => {
    //       console.log('finally');
    //     });
    //   console.log('fetch Data');
    // }, 3000);
    setSearchParties([]);
    return () => {
      //clearTimeout(setTime);
    };
  }, []);

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
      console.log('????????? ????????? ??????');
    };
  }, [partyService]);

  if (loading) {
    return <LoadingSpin loading={loading} />;
  }

  return (
    <section className=''>
      <form>
        <input
          type='text'
          placeholder='?????? ??????'
          value={searchKeyword}
          onChange={handlerChange}
        />
        <button className=''>??????</button>
      </form>
      <section className=''>
        <PartyList
          partyList={searchParties.length > 0 ? searchParties : parties}
          partyType={searchParties.length > 0 ? 'search' : 'all'}
          onJoinParty={handleJoin}
        />
      </section>
    </section>
  );
}
