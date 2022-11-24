import React, { forwardRef, memo } from 'react';
import { parseDate } from '../../util/data';
import styles from './partyList.module.css';
import { TbMoodEmpty } from 'react-icons/tb';
import { IconContext } from 'react-icons';
const PartyList = forwardRef(
  (
    { partyList, partyType, onJoinParty, lastListElement, onScrollSave },
    ref
  ) => {
    //상위 컴포넌트에게 현재 파티 스크롤위치 저장
    if (partyList.length === 0) {
      return (
        <section className={styles.partyEmpty}>
          <p className={styles.emptyText}>현재 등록된 파티가 없습니다.</p>
          <IconContext.Provider value={{ className: styles.icon }}>
            <TbMoodEmpty />
          </IconContext.Provider>
        </section>
      );
    }
    return (
      <ul className={styles.partyContainer} ref={ref}>
        {partyList &&
          partyList.map((data, index) => {
            return (
              <li
                key={data.id}
                className={styles.partyItem}
                onClick={() => onJoinParty(data.id, data.restaurantId)}
                ref={
                  index === partyList.length - 1
                    ? lastListElement && lastListElement
                    : null
                }
                data-partytype={partyType ? partyType : 'null'}
              >
                <h3>{data.title}</h3>
                <p>식당 : {data.restaurant}</p>
                <p>
                  현재 인원 : {data.currentCount}/{data.maximumCount} |{' '}
                  {`생성 시간 : ${parseDate(data.createdAt)}`} |{' '}
                  {`매칭 상태 : ${
                    data.status === 'NON_MATCHED' ? '대기중' : '시작'
                  }`}
                </p>
              </li>
            );
          })}
        {partyList.length === 0 && <li>'검색결과가 없습니다.'</li>}
      </ul>
    );
  }
);

function wordSkip(word) {
  if (word.length > 15) {
    return `${word.slice(0, 15)}...`;
  }
  return word;
}

// const PartyList = memo(
//   ({ partyList, partyType, onJoinParty, lastListElement, onScrollSave }) => {
//     console.log('PartyList.jsx');
//     console.log(partyList);
//     console.log(lastListElement);
//     //상위 컴포넌트에게 현재 파티 스크롤위치 저장

//     return (
//       <ul
//         className={styles.partyContainer}
//         onScroll={onScrollSave && onScrollSave}
//       >
//         {partyList &&
//           partyList.map((data, index) => {
//             return (
//               <li
//                 key={data.id}
//                 className={styles.partyItem}
//                 onClick={() => onJoinParty(data.id, data.restaurantId)}
//                 ref={
//                   index === partyList.length - 1
//                     ? lastListElement && lastListElement
//                     : null
//                 }
//                 data-partytype={partyType ? partyType : 'null'}
//               >
//                 <h3>{data.title}</h3>
//                 <p>식당 : {data.restaurant}</p>
//                 <p>
//                   현재인원 : {data.currentCount}/{data.maximumCount} |{' '}
//                   {`생성 시간 : ${parseDate(data.createdAt)}`} |{' '}
//                   {`매칭상태 : ${data.status}`}
//                 </p>
//               </li>
//             );
//           })}
//         {partyList.length === 0 && <li>'검색결과없다씨발아'</li>}
//       </ul>
//     );
//   }
// );

export default PartyList;
