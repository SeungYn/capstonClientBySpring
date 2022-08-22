import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';
import { GiSiren } from 'react-icons/gi';

const MyParty = ({ partyService }) => {
  const [party, setParty] = useState();
  const { state } = useLocation();
  const [memberCount, setMemberCount] = useState('');
  const nav = useNavigate();

  const onReady = () => {
    partyService.partyReady().then((data) =>
      
      party.members.map((data) => console.log(data));
      // setParty((data) => {
      //   console.log(data);
      //   console.log(party.members);
      //   const updated = party.members.map((item) => {
      //     if (item.id === data.userId) {
      //       item.id = data.userId;
      //       return item;
      //     }
      //     return item;
      //   });

      //   return updated;
      // })
    );
  };

  useEffect(() => {
    if (state) {
      console.log(state);
      setParty({ ...state.party });
      return;
    }

    partyService
      .getMyParty() //
      .then((data) => {
        //length = data.members.length;
        console.log('qwd', data);
        if (data == null) {
          console.log('파티 x');
          return nav('/partyEmpty');
        }
        setParty({ ...data });
        setMemberCount(memberCount);
      });
  }, [partyService]);

  return (
    <section className={styles.myParty__container}>
      {party && <MyPartyItem onReady={onReady} party={party} />}

      {party && (
        <div className={styles.myParty__middle}>
          <ul className={styles.partyInfo}>
            <h2 className={styles.party__info}>Info</h2>
            <li className={styles.partyInfo__title}>제목 : {party.title}</li>
            {/* <li className={styles.partyInfo__resTitle}>{party.</li>
        <li className={styles.partyInfo__address}></li> */}
            <li className={styles.partyInfo__partyMaster}>
              방장 : {party.owner}
            </li>
            <li className={styles.partyInfo__count}>
              인원수 : {`${party.currentCount} / ${party.maximumCount}`}
            </li>
          </ul>
          <div className={styles.report}>
            <button className={styles.btnGroup__btn} onClick={onReady}>
              준비하기
            </button>
          </div>
        </div>
      )}

      <div className={styles.btnGroup}>
        <div className={styles.btnGroup__right}>
          <button className={styles.btnGroup__btn}>채팅하기</button>
          <button className={styles.btnGroup__btn}>나가기</button>
        </div>
      </div>
    </section>
  );
};

export default MyParty;
