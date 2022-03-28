import { useEffect, useRef } from 'react';
import './App.css';

function App({ kakao }) {
  let latitude = '';
  let longitude = '';
  const mapRef = useRef();
  const success = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
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
    console.log(latitude, 1);
    const mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
      level: 1, // 지도의 확대 레벨
    };
    console.log(mapContainer);
    console.log(mapRef);
    console.log(mapRef.current);
    const map = new kakao.maps.Map(mapContainer, mapOption);
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
