import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './firstPage.module.css';

import PartyList from '../../components/partyList/partyList';
import PartyButton from '../../components/common/partyButton/partyButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FirstPage = ({ kakaoService, partyService }) => {
  const navigation = useNavigate();
  const mapRef = useRef();
  //현재 클릭된 식당 파티들
  const [clickedRestaurantsParties, setClickedRestaurantsParties] = useState(
    []
  );
  //현재 클릭된 식당 정보
  const [clickedRestaurantInfo, setClickedRestaurantInfo] = useState('');

  //드래그 state
  const dragRef = useRef();
  const reizeContainerRef = useRef();
  const [initialPos, setInitialPos] = useState(null);
  const [initialSize, setInitialSize] = useState(null);

  const userContext = useAuth();

  const dragInitial = useCallback((e) => {
    setInitialPos(e.clientY);
    setInitialSize(reizeContainerRef.current.offsetHeight);
  }, []);

  const dragResize = (e) => {
    reizeContainerRef.current.style.height = `${
      parseInt(initialSize) + parseInt(e.clientY - initialPos)
    }px`;
  };

  //파티 만들기
  const makeParty = useCallback(
    async (title, count, clickedResId) => {
      return await partyService.makePartyByRestaurantId2(
        title,
        count,
        clickedResId
      );
    },
    [partyService]
  );

  //파티 참가
  const onJoinParty = useCallback(
    (partyId, restaurantId) => {
      partyService
        .partyJoin(partyId, restaurantId)
        .then((party) => navigation('/myParty', { state: { party } }))
        .catch((error) => {
          userContext.setError(error);
        }); //
    },
    [partyService]
  );

  //마커 클릭시 이벤트 함수
  const markerEvent = useCallback(
    (resId) => {
      partyService.getPartyByRestaurantId(resId).then((data) => {
        //스프링 partyies
        if (data.parties) {
          setClickedRestaurantsParties([...data.parties]);
        }
        return;
      });
    },
    [partyService]
  );

  //한신대위치 중심으로 카카오맵 세팅
  useEffect(() => {
    const mapContainer = mapRef.current;
    const mapOption = kakaoService.getMapOption(37.1935, 127.022611);
    //메인지도
    const map = kakaoService.getNewMap(mapContainer, mapOption);

    kakaoService.getAllMap().then((data) => {
      if (!data) return;
      displayRestaurantInMap(
        data,
        map,
        kakaoService,
        markerEvent,
        setClickedRestaurantInfo
      );
    });

    return;
  }, [kakaoService]);

  return (
    <section className={styles.container}>
      <div ref={reizeContainerRef} className={styles.map__group}>
        <div ref={mapRef} className={styles.map_container}></div>
      </div>
      <div className={styles.dragContainer}>
        <div
          ref={dragRef}
          onDrag={dragResize}
          onDragStart={dragInitial}
          draggable={true}
          className={styles.dragBtn}
        ></div>
      </div>

      <h2 className={styles.clickedRes}>{`${
        clickedRestaurantInfo
          ? `${clickedRestaurantInfo.name}(${clickedRestaurantInfo.category})`
          : '현재 클릭된 식당이 없습니다.'
      }`}</h2>

      <PartyList
        partyList={clickedRestaurantsParties}
        onJoinParty={onJoinParty}
      />

      <PartyButton
        onMakeParty={makeParty}
        clickedRestaurant={clickedRestaurantInfo.id}
        restaurantsInfo={clickedRestaurantInfo}
        onError={userContext.setError}
      />
    </section>
  );
};

function displayRestaurantInMap(
  data,
  map,
  kakaoService,
  markerEvent,
  setClickedRestaurantInfo
) {
  const imageSrc =
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
  const markerImage = kakaoService.getMarkerImage(imageSrc, 24, 35);
  for (let i = 0; i < data.length; i++) {
    const position = {
      title: data.name,
      latlng: kakaoService.getLatLng(data[i].latitude, data[i].longitude),
    };

    const marker = kakaoService.getMapMarker(
      position.latlng,
      map,
      position.title,
      markerImage
    );

    kakaoService.addEventListener(marker, 'click', (e) => {
      markerEvent(data[i].id);
      setClickedRestaurantInfo(data[i]);
    });

    marker.setClickable(true);
  }
}
export default FirstPage;
