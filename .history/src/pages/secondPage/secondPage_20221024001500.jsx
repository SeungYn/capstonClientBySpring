import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../../components/error/error';
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
  //파티 컴포넌트에서 스크롤 top 가져오는 ref
  const partyItemScrollTopRef = useRef(null);
  const [allPartyScrollTop, setAllPartyScrollTop] = useState(0);

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

    setSearchKeyword(input);
  };

  //검색창에 focus가 됐을 때 글자가 없으면 스크롤 top 저장
  const handelerScrollHeightSave = (e) => {
    if (searchKeyword === '') {
      setAllPartyScrollTop((top) => partyItemScrollTopRef.current.scrollTop);
    }
  };

  const handelerFocus = (e) => {
    console.log(partyItemScrollTopRef.current.scrollTop);
    handelerScrollHeightSave();
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

    const partyType = node && node.dataset['partytype'];

    observer.current && observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        if (entries[0].isIntersecting) {
          console.log('마지막 리스트 ');
          if (partyType === 'all' && hasMore.all) {
            partyService.getAllParties(offset.all).then((data) => {
              const { parties } = data;
              if (data.parties.length > 0) {
                setParties((p) => [...p, ...parties]);
                setHasMore((has) => ({ ...has, all: true }));
                setOffset((offsets) => ({
                  ...offsets,
                  all: offsets.all + parties.length,
                }));
              } else {
                setHasMore((has) => ({ ...has, all: false }));
              }
            });
          } else if (partyType === 'search' && hasMore.search) {
            console.log('search');

            partyService
              .searchParties(offset.search, searchKeyword)
              .then((data) => {
                console.log(data);
                const { parties } = data;
                if (data.parties.length > 0) {
                  setSearchParties((p) => [...p, ...parties]);
                  setHasMore((has) => ({ ...has, search: true }));
                  setOffset((offsets) => ({
                    ...offsets,
                    search: offsets.search + data.parties.length,
                  }));
                } else {
                  setHasMore((has) => ({ ...has, search: false }));
                }
              });
          }
        } else {
          console.log(123);
        }
      },
      { threshold: 0.95 }
    );
    node && observer.current.observe(node);
  };

  // useEffect(() => {
  //   if (partyItemScrollTopRef.current) {
  //     console.log(partyItemScrollTopRef.current);
  //     console.log(partyItemScrollTopRef.current.scrollTop);
  //     partyItemScrollTopRef.current.scrollTop = '100px';
  //   }
  //   return () => {
  //     setAllPartyScrollTop((e) => 0);
  //   };
  // }, [parties]);

  useEffect(() => {
    if (searchKeyword === '') {
      console.log('ssss');
      setSearchParties([]);
      console.log(allPartyScrollTop);
      partyItemScrollTopRef.current.scrollTop = allPartyScrollTop;

      return;
    }

    const setTime = setTimeout(() => {
      setLoading((l) => !l);
      partyService
        .searchParties(0, searchKeyword)
        .then((data) => {
          console.log(offset.search);
          setSearchParties([...data.parties]);
          setHasMore((has) => ({ ...has, search: true }));
          setOffset((offsets) => ({ ...offsets, search: data.parties.length }));
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
  }, [searchKeyword]);

  useEffect(() => {
    setLoading((l) => !l);
    partyService
      .getAllParties(0)
      .then((data) => {
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
      setAllPartyScrollTop(0);
    };
  }, [partyService]);

  if (loading) {
    return <LoadingSpin loading={loading} />;
  }

  return (
    <section className={styles.container}>
      {userContext.error && (
        <Error error={userContext.error} onError={userContext.setError} />
      )}
      <form className={styles.inputForm}>
        <input
          type='text'
          placeholder='파티 제목'
          value={searchKeyword}
          onChange={handlerChange}
          className={styles.inputText}
          onFocus={handelerScrollHeightSave}
        />
      </form>
      <section className={styles.partyList1}>
        <PartyList
          partyList={searchKeyword ? searchParties : parties}
          partyType={searchKeyword ? 'search' : 'all'}
          onJoinParty={handleJoin}
          lastListElement={lastListElement}
          onScrollSave={handelerScrollHeightSave}
          ref={partyItemScrollTopRef}
        />
      </section>
    </section>
  );
}
