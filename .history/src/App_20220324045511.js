import { useEffect } from 'react';
import './App.css';

function App({ kakao }) {
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

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
  console.log(111);
  return <div className='App'></div>;
}

export default App;
