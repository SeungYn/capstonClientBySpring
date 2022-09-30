import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';
import { GiSiren } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import Error from '../../components/error/error';
import KickAlert from '../../components/kickAlert/kickAlert';

const MyParty = ({ partyService }) => {
  const [party, setParty] = useState({
    id: 12,
    chatRoom_id: 11,
    restaurantId: 4,
    restaurant: '플라타너스',
    title: 'e121e21e12e',
    status: 'NON_MATCHED',
    maximumCount: 4,
    currentCount: 2,
    createdAt: '2022-09-27T15:02:28.320375',
    members: [
      {
        id: 1,
        nickName: '1',
        sex: 'MALE',
        dept: '컴퓨터 공학과',
        sno: 17,
        reliability: 0,
        owner: true,
        ready: false,
      },
      {
        id: 2,
        nickName: '2',
        sex: 'MALE',
        dept: '컴퓨터 공학과',
        sno: 17,
        reliability: 0,
        owner: false,
        ready: false,
      },
    ],
  });
  const { state } = useLocation();
  const nav = useNavigate();
  //true: 준비완료 false: 준비X
  const [ready, setReady] = useState(false);
  const [master, setMaster] = useState(true);
  const navigation = useNavigate();
  const { user, error, setError } = useAuth();

  const [kickAlertSwitch, setKickAlertSwitch] = useState(false);
  // 클릭된 id
  const [clickedId, setClickedId] = useState({});

  const onChat = () => {
    console.log(party);
    navigation(`/chat/${party.id}`);
  };

  //강퇴하기
  const onKick = useCallback(
    (resId, partyId, memberId) => {
      partyService
        .deleteParty(resId, partyId, memberId)
        .then((data) => setParty({ ...data }))
        .catch(setError);
    },
    [partyService, party]
  );

  //강퇴하기 모달찰
  const onKickAlert = useCallback(() => {
    //강퇴하기를 클릭하면 모달창을 출력하고 클릭된 memberid를 넘겨주는 방식
    kickAlertSwitch ? setKickAlertSwitch(false) : setKickAlertSwitch(true);
  }, [kickAlertSwitch]);

  //파티삭제하기
  const onDelete = useCallback(() => {
    partyService
      .deleteParty(party.restaurantId, party.id)
      .then(() => navigation(`/`))
      .catch(setError);
  }, [partyService, party]);

  const onReady = useCallback(() => {
    //party state를 사용하기 떄문에 party가 바뀌면 다시 함수를 만들어 줘야함 의존성 추가
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

  const outParty = () => {
    partyService
      .outParty(party.restaurantId, party.id)
      .then((data) => {
        return nav('/');
      })
      .catch(setError);
  };

  useEffect(() => {
    // let mount = true;
    // partyService
    //   .getMyParty() //
    //   .then((data) => {
    //     //length = data.members.length;
    //     console.log(data);
    //     if (data == null) {
    //       console.log('파티 x');
    //       return nav('/partyEmpty');
    //     }
    //     if (mount) {
    //       // 컴포넌트가 Unmount가 됐을 때 mount가 false로 바뀜 그러면 setState를 못쓰게해서 업데이트 되지 않도록 함
    //       const me = data.members.find((item) => item.id == user);
    //       console.log(user);
    //       console.log(me);
    //       me.owner && setMaster(true);
    //       me.ready && setReady(true);
    //       setParty({ ...data });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     return nav('/partyEmpty');
    //   });
    // return () => {
    //   mount = false;
    // };
  }, [partyService]);

  return (
    <section className={styles.myParty__container}>
      {error && <Error error={error} onError={setError} />}
      {kickAlertSwitch && (
        <KickAlert
          party={party}
          setSwitch={setKickAlertSwitch}
          clickedMember={clickedId}
          setClickMember={setClickedId}
        />
      )}
      {party && (
        <MyPartyItem
          onReady={onReady}
          party={party}
          onKick={onKick}
          master={master}
          setClickedId={setClickedId}
          setKickAlertSwitch={setKickAlertSwitch}
        />
      )}

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
          <button
            className={styles.btnGroup__btn}
            onClick={master ? onDelete : outParty}
          >
            {master ? '파티 삭제하기' : '파티 나가기'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyParty;
