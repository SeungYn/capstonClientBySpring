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

  const success = (position) => {
    const mapOption = {
      center: new kakao.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const mapContainer = document.querySelector('.kakao-map');
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
    const id = navigator.geolocation.watchPosition(success, error, options);
  }, [navigator.geolocation]);
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
