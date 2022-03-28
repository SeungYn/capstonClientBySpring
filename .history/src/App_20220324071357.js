import { useEffect, useRef, useState } from 'react';
import './App.css';

function App({ kakao }) {
  const mapRef = useRef();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const success = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    console.log(latitude, longitude);
  };

  const error = () => {
    console.log('시래패패패패');
  };

  if (!navigator.geolocation) {
    console.log('사용불가능');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  useEffect(() => {
    const mapContainer = document.querySelector('.kakao-map');
    console.log(latitude);
    const mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    const target = {
      latitude: 0,
      longitude: 0,
    };

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

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
