import React, { useCallback, useEffect, useRef, useState } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
import PartyList from '../../components/partyList/partyList';
import PartyButton from '../../components/common/partyButton/partyButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Error from '../../components/error/error';

const FirstPage = ({ kakao, kakaoService, partyService }) => {
  const navigation = useNavigate();
  //실시간 위치추적시 이전에 있던 위치 marker
  const [preMarker, setPreMarker] = useState(null);
  const [exception, setException] = useState('');
  const [makers, setMakers] = useState([]);
  //const [datas, setDatas] = useState()

  const [mainMap, setMainMap] = useState(null);
  //지도를 출력할 div
  const mapRef = useRef();
  //로딩스패너 position 수정필요
  const [loading, setLoading] = useState(false);

  //식당정보
  const [restaurants, setRestaurants] = useState([]);
  //현재 클릭된 식당 파티들
  const [clickedRestaurantsParties, setClickedRestaurantsParties] = useState(
    []
  );
  //현재 클릭된 식당 id
  const [clickedRestaurant, setClickedRestaurant] = useState([]);
  //현재 클릭된 식당 정보
  const [clickedRestaurantInfo, setClickedRestaurantInfo] = useState('');

  const [markers, setMarkers] = useState([]);
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

  const dragResize = useCallback(
    (e) => {
      console.log(parseInt(initialSize) + parseInt(e.clientY - initialPos));
      reizeContainerRef.current.style.height = `${
        parseInt(initialSize) + parseInt(e.clientY - initialPos)
      }px`;
    },
    [initialSize]
  );

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
          console.log(error);
          userContext.setError(error);
        }); //
    },
    [partyService]
  );

  //마커 클릭시 이벤트 함수
  const markerEvent = useCallback(
    (resId) => {
      partyService.getPartyByRestaurantId(resId).then((data) => {
        console.log(data);
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
    setMainMap(map);
    // const markerPosition = kakaoService.getLatLng(37.1935, 127.022611);
    // const marker = kakaoService.getMapMarker(markerPosition, map);

    kakaoService.getAllMap().then((data) => {
      //별 풍선 이미지 나중에 수정필요
      if (!data) return null;
      setRestaurants([...data]);

      const mks = [];
      const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      for (let i = 0; i < data.length; i++) {
        const imageSize = kakaoService.getMarkerImageSize(24, 35);
        const markerImage = kakaoService.getMarkerImage(imageSrc, imageSize);
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

        mks.push(marker);

        kakaoService.addEventListener(marker, 'click', () => {
          markerEvent(data[i].id);
          setClickedRestaurant(data[i].id);
          setClickedRestaurantInfo(data[i]);
        });
        kakao.maps.event.removeListener(marker, 'click', function () {
          console.log(data[i]);
        });
        marker.setClickable(true);
      }

      setMakers([...mks]);

      return () => {
        setRestaurants([...data]);
      };
    });

    return console.log('test2222');
  }, [kakaoService]);

  return (
    <section className={styles.container}>
      <div ref={reizeContainerRef} className={styles.map__group}>
        <div ref={mapRef} className={styles.map_container}></div>
        <LoadingSpin loading={loading} />
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
      <div>식당</div>
      <PartyList
        partyList={clickedRestaurantsParties}
        onJoinParty={onJoinParty}
      />

      <PartyButton
        onMakeParty={makeParty}
        clickedRestaurant={clickedRestaurant}
        restaurantsInfo={clickedRestaurantInfo}
        onError={userContext.setError}
      />
    </section>
  );
};

export default FirstPage;
