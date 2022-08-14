import React, { useEffect, useRef, useState } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
import PartyList from '../../components/partyList/partyList';
import PartyButton from '../../components/common/partyButton/partyButton';

const FirstPage = ({ kakao, kakaoService, partyService }) => {
  //현재 사용자위치 1회성
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  //처음 접속했을때 위치를 담은 marker
  const [firstMarker, setFirstMarker] = useState(null);
  //실시간 위치추적시 이전에 있던 위치 marker
  const [preMarker, setPreMarker] = useState(null);

  const [makers, setMakers] = useState([]);
  //const [datas, setDatas] = useState()
  //현재 사용자 위치 추적
  const { location, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const [mainMap, setMainMap] = useState(null);
  //지도를 출력할 div
  const mapRef = useRef();
  //로딩스패너 position 수정필요
  const [loading, setLoading] = useState(false);

  //const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  //식당정보
  const [restaurants, setRestaurants] = useState([]);
  //현재 클릭된 식당 파티들
  const [clickedRestaurantsParties, setClickedRestaurantsParties] = useState(
    []
  );
  //현재 클릭된 식당 id
  const [clickedRestaurant, setClickedRestaurant] = useState([]);

  const [markers, setMarkers] = useState([]);
  //드래그 state
  const dragRef = useRef();
  const reizeContainerRef = useRef();
  const [initialPos, setInitialPos] = useState(null);
  const [initialSize, setInitialSize] = useState(null);

  const dragInitial = (e) => {
    setInitialPos(e.clientY);
    setInitialSize(reizeContainerRef.current.offsetHeight);
  };

  const dragResize = (e) => {
    console.log(parseInt(initialSize) + parseInt(e.clientY - initialPos));
    reizeContainerRef.current.style.height = `${
      parseInt(initialSize) + parseInt(e.clientY - initialPos)
    }px`;
  };

  //파티 만들기
  const makeParty = (id, title, count) => {
    partyService.makePartyByRestaurantId(id, title, count).then(console.log);
  };

  //마커 클릭시 이벤트 함수
  const markerEvent = (resId) => {
    partyService
      .getPartyByRestaurantId(resId)
      .then((data) => setClickedRestaurantsParties(data.parties));
  };

  //사용자위치 중심으로 카카오맵 세팅
  useEffect(() => {
    console.log('start');
    if (!currentLocation) {
      setLoading(true);
      return;
    }
    setLoading(false);
    const mapContainer = mapRef.current;
    const mapOption = kakaoService.getMapOption(37.1935, 127.022611);
    //메인지도
    const map = kakaoService.getNewMap(mapContainer, mapOption);
    setMainMap(map);
    const markerPosition = kakaoService.getLatLng(37.1935, 127.022611);
    const marker = kakaoService.getMapMarker(markerPosition, map);
    setFirstMarker(marker);

    kakaoService.getAllMap().then((data) => {
      console.log('ㅎ');
      //별 풍선 이미지 나중에 수정필요
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
        console.log(data[i].latitude, data[i].longitude);
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
  }, [currentLocation, currentError]);

  // 현재위치추적
  useEffect(() => {
    console.log('555');
    if (firstMarker) {
      //기존마커 제거
      firstMarker.setMap(null);
      setFirstMarker(null);
    }
    if (location && mainMap) {
      const markerPosition = kakaoService.getLatLng(
        location.latitude,
        location.longitude
      );

      const marker = kakaoService.getMapMarker(markerPosition, mainMap);

      setPreMarker(marker);
      preMarker && preMarker.setMap(null);
    }

    return () => {
      cancelLocationWatch();
    };
  }, [location]);

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

      {clickedRestaurant && <PartyList partyList={clickedRestaurantsParties} />}

      <PartyButton
        onMakeParty={makeParty}
        clickedRestaurant={clickedRestaurant}
      />
    </section>
  );
};

export default FirstPage;
