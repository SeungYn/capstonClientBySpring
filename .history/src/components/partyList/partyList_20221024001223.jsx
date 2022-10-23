import React, { forwardRef, memo } from 'react';
import { parseDate } from '../../util/data';
import styles from './partyList.module.css';

const PartyList = forwardRef(
  (
    { partyList, partyType, onJoinParty, lastListElement, onScrollSave },
    ref
  ) => {
    console.log('PartyList.jsx');

    //상위 컴포넌트에게 현재 파티 스크롤위치 저장

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
                  현재인원 : {data.currentCount}/{data.maximumCount} |{' '}
                  {`생성 시간 : ${parseDate(data.createdAt)}`} |{' '}
                  {`매칭상태 : ${data.status}`}
                </p>
              </li>
            );
          })}
        {partyList.length === 0 && <li>'검색결과가 없습니다.'</li>}
      </ul>
    );
  }
);

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
