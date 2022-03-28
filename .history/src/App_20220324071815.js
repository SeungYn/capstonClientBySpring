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
    const mapContainer = document.querySelector('.kakao-map');

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
