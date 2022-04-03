import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import FirstPage from './pages/firstPage/firstPage';

function App({ kakao, kakaoService }) {
  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route
          exact
          path='/'
          element={<FirstPage kakao={kakao} kakaoService={kakaoService} />}
        />
      </Routes>
    </div>
  );
}

export default App;
