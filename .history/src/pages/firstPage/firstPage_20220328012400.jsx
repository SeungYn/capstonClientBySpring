import React, { useEffect, useRef } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
const FirstPage = ({ kakao }) => {
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  const mapRef = useRef();
  useEffect(() => {
    if (!currentLocation) {
      console.log(currentLocation);
      return;
    }

    // Cancel location watch after 3sec
    // setTimeout(() => {
    //   cancelLocationWatch();
    //   setIsWatchForLocation(false);
    // }, 3000);

    const mapContainer = mapRef.current;
    const mapOption = {
      center: new kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude
      ),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const markerPosition = new kakao.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch('이태원 맛집', placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);
      }
    }
  }, [currentLocation]);
  return (
    <section className={styles.container}>
      <div ref={mapRef} className={styles.map_container}></div>
    </section>
  );
};

export default FirstPage;
