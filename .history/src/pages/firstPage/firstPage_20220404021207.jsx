import React, { useEffect, useRef, useState } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
const FirstPage = ({ kakao, kakaoService }) => {
  //현재 사용자위치 1회성
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  //처음 접속했을때 위치를 담은 marker
  const [firstMarker, setFirstMarker] = useState(null);
  //실시간 위치추적시 이전에 있던 위치 marker
  const [preMarker, setPreMarker1] = useState(null);
  const [ttt11, setTtt11] = useState('');
  //현재 사용자 위치 추적
  const { location, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const [mainMap, setMainMap] = useState(null);
  //지도를 출력할 div
  const mapRef = useRef();
  //로딩스패너 position 수정필요
  const [loading, setLoading] = useState(false);

  const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  //식당정보
  const [restaurants, setRestaurants] = useState([]);
  //현재 클릭된 식당 파티들
  const [clickedRestaurantsParties, setClickedRestaurantsParties] = useState(
    []
  );
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

  //map 관련함수
  // const placesSearchCB = (data, status, pagination, map) => {
  //   if (status === kakao.maps.services.Status.OK) {
  //     for (var i = 0; i < data.length; i++) {
  //       const {
  //         id,
  //         address_name,
  //         place_name,
  //         x: longitude,
  //         y: latitude,
  //         category_group_name,
  //       } = data[i];
  //       console.log(
  //         `${id},${address_name},${place_name},${longitude},${latitude},${category_group_name}`
  //       );
  //       displayMarker(data[i]);
  //     }
  //   }
  // };

  // const displayMarker = (place) => {
  //   const marker = new kakao.maps.Marker({
  //     map,
  //     position: new kakao.maps.LatLng(place.y, place.x),
  //   });
  //   console.log(99);
  //   kakao.maps.event.addListener(marker, 'click', () => {
  //     infowindow.setContent(
  //       '<div style="padding:5px;font-size:12px;">' +
  //         place.place_name +
  //         '</div>'
  //     );
  //     infowindow.open(map, marker);
  //   });
  // };

  //사용자위치 중심으로 카카오맵 세팅
  useEffect(() => {
    console.log('start');
    if (!currentLocation) {
      console.log(1);
      setLoading(true);
      console.log(currentLocation);
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
      //별 풍선 이미지 나중에 수정필요
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

        kakaoService.addEventListener(marker, 'click', function () {
          console.log(data[i]);
        });
      }

      return setRestaurants([...data]);
    });
  }, [currentLocation, currentError]);

  // 현재위치추적
  useEffect(() => {
    if (firstMarker) {
      //기존마커 제거
      firstMarker.setMap(null);
      setFirstMarker(null);
    }
    if (location && mainMap) {
      const mapContainer = mapRef.current;
      const mapOption = kakaoService.getMapOption(
        location.latitude,
        location.longitude
      );

      const markerPosition = kakaoService.getLatLng(
        location.latitude,
        location.longitude
      );

      console.log(location);
      const marker1 = kakaoService.getMapMarker(markerPosition, mainMap);
      setTtt11('1');
      console.log(11);
    }
    console.log(123123);
  }, [location, cancelLocationWatch]);

  // useEffect(() => {
  //   // if (!currentLocation) {
  //   //   console.log(currentLocation);
  //   //   setLoading(true);
  //   //   return;
  //   // }

  //   setLoading(false);
  //   // Cancel location watch after 3sec
  //   // setTimeout(() => {
  //   //   cancelLocationWatch();
  //   //   setIsWatchForLocation(false);
  //   // }, 3000);

  //   const mapContainer = mapRef.current;
  //   const mapOption = {
  //     center: new kakao.maps.LatLng(
  //       // currentLocation.latitude,
  //       // currentLocation.longitude
  //       37.1935,
  //       127.022611
  //     ),
  //     level: 3,
  //   };

  //   //const map = new kakao.maps.Map(mapContainer, mapOption);
  //   setMap(new kakao.maps.Map(mapContainer, mapOption));

  //   console.log(map);

  //   // 키워드로 장소를 검색합니다
  // }, []);

  // useEffect(() => {
  //   console.log(1);
  //   const markerPosition = new kakao.maps.LatLng(
  //     // currentLocation.latitude,
  //     // currentLocation.longitude
  //     37.1935,
  //     127.022611
  //   );
  //   const marker = new kakao.maps.Marker({
  //     position: markerPosition,
  //   });
  //   marker.setMap(map);

  //   const ps = new kakao.maps.services.Places(map);
  //   //ps.categorySearch('FD6', placesSearchCB, { useMapBounds: true });
  //   ps.keywordSearch('한신대학교 맛집', placesSearchCB);
  // }, [map]);

  return (
    <section className={styles.container}>
      <div ref={reizeContainerRef} className={styles.map__group}>
        <div ref={mapRef} className={styles.map_container}>
          <LoadingSpin loading={loading} />
        </div>
      </div>
      <section className={styles.dragContainer}>
        <div
          ref={dragRef}
          onDrag={dragResize}
          onDragStart={dragInitial}
          draggable={true}
          className={styles.dragBtn}
        ></div>
      </section>
    </section>
  );
};

export default FirstPage;
