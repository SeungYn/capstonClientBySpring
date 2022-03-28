import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      nickname: '유승윤태민',
      loginId: 'xoals4340',
      password: '111',
      sex: '남자',
      email: 'xopal@asd',
      university: 'asg',
      dept: 'sad',
      sno: 17,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://04a815f36f34f2.lhrtunnel.link/join', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }, []);
  return <div className='App'>ㅇ</div>;
}

export default App;
