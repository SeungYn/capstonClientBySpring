import React, { useEffect, useRef, useState } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
const FirstPage = ({ kakao }) => {
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  const mapRef = useRef();
  const [loading, setLoading] = useState(false);
  const displayMaker = (place) => {
    const maker = new kakao.maps.Marker({
      map: 1,
    });
  };
  const test = (e) => {
    console.log(e);
  };
  useEffect(() => {
    if (!currentLocation) {
      console.log(currentLocation);
      setLoading(true);
      return;
    }
    setLoading(false);
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
  }, [currentLocation]);
  return (
    <section className={styles.container}>
      <div className={styles.map__group} onDrag={test}>
        <div ref={mapRef} className={styles.map_container}>
          <LoadingSpin loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default FirstPage;
