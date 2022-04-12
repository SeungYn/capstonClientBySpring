import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import FirstPage from './pages/firstPage/firstPage';
import Footer from './components/common/footer/footer';
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
      <Footer />
    </div>
  );
}

export default App;
