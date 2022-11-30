import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import MyInfo from './pages/myInfo/MyInfo';
import ReadPopup from './components/ReadPopup/ReadPopup';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import NewChat from './pages/NewChat/NewChat';

function App({ kakao, kakaoService, partyService, chatService, authService }) {
  const { user, logout, error, setError } = useAuth();
  const location = useLocation();
  return (
    <div className='app'>
      {error && (
        <ReadPopup content={error} onHandler={setError} type={'error'} />
      )}
      <Header user={user} onLogout={logout} />
      <TransitionGroup className='transition-group '>
        <CSSTransition classNames='fade' timeout={300} key={location.pathname}>
          <Routes location={location}>
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
            <Route
              exact
              path='/myParty'
              element={
                <MyParty
                  partyService={partyService}
                  chatService={chatService}
                />
              }
            />

            <Route
              exact
              path='/allParty'
              element={<SecondPage partyService={partyService} />}
            />
            <Route
              exact
              path='/chat'
              element={
                <Chat chatService={chatService} kakaoService={kakaoService} />
              }
            />
            <Route
              exact
              path='/newChat'
              element={
                <NewChat
                  chatService={chatService}
                  kakaoService={kakaoService}
                />
              }
            />
            <Route
              exact
              path='/myInfo'
              element={<MyInfo authService={authService} />}
            />
            <Route exact path='/partyEmpty' element={<EmptyPartyPage />} />
            <Route
              path='/*'
              element={
                <FirstPage
                  kakao={kakao}
                  kakaoService={kakaoService}
                  partyService={partyService}
                />
              }
            />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  );
}

export default App;
