import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = 'tmddbs3124@hs.ac.kr';

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://04a815f36f34f2.lhrtunnel.link/mail-auth', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }, []);
  return <div className='App'>ㅇ</div>;
}

export default App;
