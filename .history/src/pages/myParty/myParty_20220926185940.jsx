import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';
import { GiSiren } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import Error from '../../components/error/error';

const MyParty = ({ partyService }) => {
  const [party, setParty] = useState();
  const { state } = useLocation();
  const nav = useNavigate();
  //true: 준비완료 false: 준비X
  const [ready, setReady] = useState(false);
  const [master, setMaster] = useState(false);
  const navigation = useNavigate();
  const { user, error, setError } = useAuth();

  const onChat = () => {
    console.log(party);
    navigation(`/chat/${party.id}`);
  };

  const onReady = useCallback(() => {
    partyService
      .partyReady(party.restaurantId, party.id)
      .then((data) => {
        console.log(data);
        const me = data.members.find((member) => member.id == user);
        if (!me.owner) {
          setReady(me.ready);
        }
        setParty({ ...data });
      })
      .catch(setError);
  }, [partyService, party]);

  const unReady = useCallback(() => {
    partyService.partyUnReady().then((data) =>
      setParty((partys) => {
        const up = partys.members.map((i) => {
          if (i.id === data.userId) {
            i.ready = 0;
            return i;
          } else {
            return i;
          }
        });
        console.log({ ...partys, members: up });
        setReady(false);
        return { ...partys, members: up };
      })
    );
  }, [partyService]);

  const outParty = () => {
    partyService
      .outParty(party.restaurantId, party.id)
      .then((data) => {
        return nav('/');
      })
      .catch(setError);
  };

  useEffect(() => {
    let mount = true;

    partyService
      .getMyParty() //
      .then((data) => {
        //length = data.members.length;

        if (data == null) {
          console.log('파티 x');
          return nav('/partyEmpty');
        }
        if (mount) {
          // 컴포넌트가 Unmount가 됐을 때 mount가 false로 바뀜 그러면 setState를 못쓰게해서 업데이트 되지 않도록 함
          const me = data.members.find((item) => item.id == user);

          me.owner && setMaster(true);
          me.ready && setReady(true);

          setParty({ ...data });
        }
      })
      .catch((error) => {
        console.log(error);
        return nav('/partyEmpty');
      });

    return () => {
      mount = false;
    };
  }, [partyService]);

  return (
    <section className={styles.myParty__container}>
      {error && <Error error={error} onError={setError} />}
      {party && <MyPartyItem onReady={onReady} party={party} />}

      {party && (
        <div className={styles.myParty__middle}>
          <ul className={styles.partyInfo}>
            <h2 className={styles.party__info}>Info</h2>
            <li className={styles.partyInfo__title}>제목 : {party.title}</li>
            {/* <li className={styles.partyInfo__resTitle}>{party.</li>
        <li className={styles.partyInfo__address}></li> */}
            <li className={styles.partyInfo__partyMaster}>
              방장 :{' '}
              {party.members.map((i) => {
                if (i.owner == true) {
                  return i.nickName;
                }
              })}
            </li>
            <li className={styles.partyInfo__count}>
              인원수 : {`${party.currentCount} / ${party.maximumCount}`}
            </li>
            <li className={styles.partyInfo__state}>
              파티상태 :{' '}
              {`${party.status == 'NON_MATCHED' ? '대기중' : '시작'}`}
            </li>
          </ul>
          <div className={styles.report}>
            {party.status == 'NON_MATCHED' ? (
              <button
                className={`${styles.btnGroup__btn} ${
                  master ? '' : ready ? styles.unReady__btn : ''
                }`}
                onClick={onReady}
              >
                {master ? '시작하기' : ready ? '준비해제' : '준비하기'}
              </button>
            ) : (
              <div>신고하기</div>
            )}
          </div>
        </div>
      )}

      <div className={styles.btnGroup}>
        <div className={styles.btnGroup__right}>
          <button className={styles.btnGroup__btn} onClick={onChat}>
            채팅하기
          </button>
          <button className={styles.btnGroup__btn} onClick={outParty}>
            나가기
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyParty;
