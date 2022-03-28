import { useEffect } from 'react';
import './App.css';

function App({ kakao }) {
  let latitude = '';
  let longitude = '';
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
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
  }, []);
  return (
    <div className='App'>
      <div
        className='kakao-map'
        style={{ width: '1000px', height: '50%;' }}
      ></div>
    </div>
  );
}

export default App;
