import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './myParty.module.css';
import MyPartyItem from './myPartyItem';
import { GiSiren } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import Error from '../../components/error/error';
import KickAlert from '../../components/kickAlert/kickAlert';
import ReportModal from '../../components/reportModal/reportModal';
import ReportContent from '../../components/reportContent/reportContent';

const MyParty = ({ partyService }) => {
  const [party, setParty] = useState();
  const { state } = useLocation();
  const nav = useNavigate();
  //true: 준비완료 false: 준비X
  const [ready, setReady] = useState(false);
  const [master, setMaster] = useState(false);
  const navigation = useNavigate();
  const { user, error, setError } = useAuth();

  const [kickAlertSwitch, setKickAlertSwitch] = useState(false);
  const [reportAlertSwitch, setReportAlertSwitch] = useState(false);
  const [reportContentSwitch, setReportContentSwitch] = useState(false);
  const [reportContent, setReportContent] = useState([]);
  // 클릭된 member
  const [clickedId, setClickedId] = useState({});

  const onChat = () => {
    console.log(party);
    navigation(`/chat/${party.id}`);
  };

  //강퇴하기
  const onKick = useCallback(
    (resId, partyId, memberId) => {
      console.log(resId, partyId, memberId);
      partyService
        .kickParty(resId, partyId, memberId)
        .then((data) => {
          console.log(data);
          setParty({ ...data });
        })
        .catch(setError);
    },
    [partyService, party]
  );

  //유저신고사유보기
  const onReportContent = (resId, partyId, targetId) => {
    console.log(resId, partyId, targetId);
    partyService
      .reportContent(resId, partyId, targetId)
      .then((res) => {
        console.log(res);
        setReportContentSwitch(true);
        setReportContent([...res.reportList]);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
  };

  //신고하기
  const onReport = (resId, partyId, targetId, reportType, description) => {
    console.log(resId, partyId, targetId, reportType, description);
    partyService
      .reportParty(resId, partyId, targetId, reportType, description)
      .catch(setError);
  };

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

        const me = data.members.find((member) => {
          console.log(member.id == user, '비교');
          console.log(member.id);
          return member.id == user;
        });
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
    let mount = true;
    partyService
      .getMyParty() //
      .then((data) => {
        //length = data.members.length;
        console.log(data);
        if (data == null) {
          console.log('파티 x');
          return nav('/partyEmpty');
        }
        if (mount) {
          // 컴포넌트가 Unmount가 됐을 때 mount가 false로 바뀜 그러면 setState를 못쓰게해서 업데이트 되지 않도록 함
          const me = data.members.find((item) => item.id == user);
          console.log(user);
          console.log(me, 'me');
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
      {reportContentSwitch && (
        <ReportContent
          setSwitch={setReportContentSwitch}
          reportContent={reportContent}
        />
      )}
      {kickAlertSwitch && (
        <KickAlert
          party={party}
          setSwitch={setKickAlertSwitch}
          clickedMember={clickedId}
          setClickMember={setClickedId}
          onKick={onKick}
        />
      )}
      {reportAlertSwitch && (
        <ReportModal
          party={party}
          setSwitch={setReportAlertSwitch}
          clickedMember={clickedId}
          setClickMember={setClickedId}
          onReport={onReport}
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
          user={user}
          setReportAlertSwitch={setReportAlertSwitch}
          onReportContent={onReportContent}
          setReportContentSwitch={setReportContentSwitch}
        />
      )}

      {party && (
        <div className={styles.myParty__middle}>
          <ul className={styles.partyInfo}>
            <h3 className={styles.party__info}>파티 정보</h3>
            <li className={styles.partyInfo__title}>제목 : {party.title}</li>
            {/* <li className={styles.partyInfo__resTitle}>{party.</li>
        <li className={styles.partyInfo__address}></li> */}
            <li className={styles.partyInfo__partyMaster}>
              방장 :{' '}
              {party.members.map((i) => {
                if (i.owner == true) {
                  return i.nickname;
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
              <div>방이 시작되었습니다.</div>
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
