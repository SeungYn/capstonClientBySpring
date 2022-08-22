import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import FirstPage from './pages/firstPage/firstPage';
import Footer from './components/common/footer/footer';
import MyParty from './pages/myParty/myParty';
import { useAuth } from './context/AuthContext';
import SecondPage from './pages/secondPage/secondPage';

function App({ kakao, kakaoService, partyService }) {
  const { user, logout } = useAuth();

  return (
    <div className='app'>
      <Header user={user} onLogout={logout} />
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
      <Routes>
        <Route
          exact
          path='/myParty'
          element={<MyParty partyService={partyService} />}
        />
      </Routes>
      {/* <Routes>
        <Route exact path='/trade' element={<SecondPage />} />
      </Routes> */}
      <Footer />
    </div>
  );
}

export default App;
