import './App.css';

function App({ kakao }) {
  console.log(kakao);
  if ('geolocation' in navigator) {
    console.log(1);
  } else {
    console.log(2);
  }
  return <div className='App'></div>;
}

export default App;
