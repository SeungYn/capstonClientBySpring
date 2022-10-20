import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
import PartyList from '../../components/partyList/partyList';
import { useAuth } from '../../context/AuthContext';
import styles from './secondPage.module.css';

export default function SecondPage({ partyService }) {
  const userContext = useAuth();
  const navigation = useNavigate();
  const [parties, setParties] = useState([]);
  const [searchParties, setSearchParties] = useState([]);
  const [offset, setOffset] = useState({ all: 0, search: 0 });
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  //무한스크롤
  const observer = useRef();
  const [hasMore, setHasMore] = useState({ all: false, search: false });

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
    console.log('changeHandler');
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

  const lastListElement = (node) => {
    console.log(node);
    observer.current && observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      console.log('스크롤 감시 객체 생성');
      if (entries[0].isIntersecting) {
        console.log('마지막 리스트 ');
      }
    });
  };

  useEffect(() => {
    if (searchKeyword === '') {
      setSearchParties([]);
      return;
    }

    const setTime = setTimeout(() => {
      setLoading((l) => !l);
      partyService
        .searchParties(offset.search, searchKeyword)
        .then((data) => {
          setSearchParties([...data.parties]);
        })
        .catch(console.log)
        .finally(() => {
          console.log('finally');
          setLoading((l) => !l);
        });
      console.log('fetch Data');
    }, 3000);

    return () => {
      clearTimeout(setTime);
    };
  }, [searchKeyword, offset]);

  useEffect(() => {
    setLoading((l) => !l);
    partyService
      .getAllParties(0)
      .then((data) => {
        console.log(data);
        setParties([...data.parties]);
        setHasMore((has) => ({ ...has, all: true }));
        setOffset((offsets) => ({ ...offsets, all: data.parties.length }));
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
    <section className={styles.container}>
      <form>
        <input
          type='text'
          placeholder='파티 제목'
          value={searchKeyword}
          onChange={handlerChange}
        />
      </form>
      <section className=''>
        <PartyList
          partyList={searchParties.length > 0 ? searchParties : parties}
          partyType={searchParties.length > 0 ? 'search' : 'all'}
          onJoinParty={handleJoin}
          lastListElement={lastListElement}
        />
      </section>
    </section>
  );
}
