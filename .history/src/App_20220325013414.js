import { useEffect, useRef, useState } from 'react';
import './App.css';
import useCurrentLocation from './hooks/useCurrentLocation';
import useWatchLocation from './hooks/useWatchLocation';
import { geolocationOptions } from './constants/geolocationOptions';
import Location from './components/Location';

function App({ kakao }) {
  const mapRef = useRef();
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  const { location, cancelLocationWatch, error } =
    useWatchLocation(geolocationOptions);
  const success = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    console.log(latitude, longitude);
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

  const error = () => {
    console.log('시래패패패패');
  };
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const target = {
    latitude: 0,
    longitude: 0,
  };
  useEffect(() => {
    const id = navigator.geolocation.watchPosition(success, error, options);

    console.log(id);
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
