import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import FirstPage from './pages/firstPage/firstPage';
import { BiHomeAlt } from 'react-icons/bi';
function App({ kakao, kakaoService, partyService }) {
  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route
          exact
          path='/'
          element={
            <FirstPage
              kakao={kakao}
              kakaoService={kakaoService}
              partyService={partyService}
            />
          }
        />
      </Routes>
      <BiHomeAlt color='blue' />
    </div>
  );
}

export default App;
