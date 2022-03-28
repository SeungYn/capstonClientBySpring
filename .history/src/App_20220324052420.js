import { useEffect, useRef } from 'react';
import './App.css';

function App({ kakao }) {
  let latitude = '';
  let longitude = '';
  const mapRef = useRef();
  const success = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

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
      center: new kakao.maps.LatLng(37.7507877, 127.0398281), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const markerPosition = new kakao.maps.LatLng(37.7507877, 127.0398281);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
  }, []);
  return (
    <div className='App'>
      <div
        ref={mapRef}
        className='kakao-map'
        style={{ width: '800px', height: '800px' }}
      ></div>
    </div>
  );
}

export default App;
