import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import FirstPage from './pages/firstPage/firstPage';
import Footer from './components/common/footer/footer';
import MyParty from './pages/myParty/myParty';
import { useAuth } from './context/AuthContext';
import SecondPage from './pages/secondPage/secondPage';
import EmptyPartyPage from './pages/emptyPartyPage/emptyPartyPage';
import Chat from './pages/chat/chat';
import Error from './components/error/error';
import MyInfo from './pages/myInfo/myInfo';

function App({ kakao, kakaoService, partyService, chatService, authService }) {
  const { user, logout, error, setError } = useAuth();

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
          element={
            <MyParty partyService={partyService} chatService={chatService} />
          }
        />
      </Routes>

      <Routes>
        <Route
          exact
          path='/allParty'
          element={<SecondPage partyService={partyService} />}
        />
      </Routes>

      <Routes>
        <Route
          exact
          path='/chat'
          element={
            <Chat chatService={chatService} kakaoService={kakaoService} />
          }
        />
      </Routes>

      <Routes>
        <Route
          exact
          path='/myInfo'
          element={<MyInfo authService={authService} />}
        />
      </Routes>

      <Routes>
        <Route exact path='/partyEmpty' element={<EmptyPartyPage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
