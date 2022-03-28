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

  useEffect();
  return <div className='App'></div>;
}

export default App;
