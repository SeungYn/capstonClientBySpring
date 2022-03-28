import { useEffect, useRef, useState } from 'react';
import './App.css';
import useCurrentLocation from './hooks/useCurrentLocation';
import useWatchLocation from './hooks/useWatchLocation';
import { geolocationOptions } from './constants/geolocationOptions';

function App({ kakao }) {
  const mapRef = useRef();
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  const { location, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const [mapOption, setmapOption] = useState({
    center: new kakao.maps.LatLng(location.latitude, location.longitude),
    level: 3,
  });

  const success = (position) => {
    const mapOption = {
      center: new kakao.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const mapContainer = mapRef.current;
    const map = new kakao.maps.Map(mapContainer, mapOption);
    const markerPosition = new kakao.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  };

  useEffect(() => {
    if (!location) return;
    console.log(location);
    // Cancel location watch after 3sec
    // setTimeout(() => {
    //   cancelLocationWatch();
    //   setIsWatchForLocation(false);
    // }, 3000);
    const mapOption = {
      center: new kakao.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    const mapContainer = mapRef.current;
    const map = new kakao.maps.Map(mapContainer, mapOption);
    const markerPosition = new kakao.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, [location, cancelLocationWatch]);
  return (
    <div className='App'>
      <div
        ref={mapRef}
        className='kakao-map'
        style={{ width: '300px', height: '300px' }}
      ></div>
    </div>
  );
}

export default App;
