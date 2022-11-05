import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TokenStorage from './db/token';
import HttpClient from './network/http';
import { AuthErrorEventBus, AuthProvider } from './context/AuthContext';
import AuthService from './service/auth';
import { BrowserRouter } from 'react-router-dom';
import KakaoService from './service/kakao';
import PartyService from './service/party';
import StompDI from './network/stomp';
import ChatService from './service/chat';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

const { kakao } = window;
const baseURL = 'https://45827133969f87.lhr.life'; //process.env.REACT_APP_BASE_URL; //http://192.168.219.102:8080'; //'http://localhost:8080';
const tokenStorage = new TokenStorage();
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL, authErrorEventBus, tokenStorage);
const authService = new AuthService(httpClient, tokenStorage);
const stompClient = new StompDI(baseURL, () => tokenStorage.getToken());
const kakaoService = new KakaoService(httpClient, tokenStorage, kakao);
const partyService = new PartyService(httpClient, tokenStorage);
const chatService = new ChatService(httpClient, tokenStorage, stompClient);
console.log('index');
ReactDOM.render(
  <BrowserRouter basename=''>
     <TransitionGroup className='app'>
      <CSSTransition key={location.pathname} classNames='fade' timeout={500}></CSSTransition>
     
    <AuthProvider
      authService={authService}
      authErrorEventBus={authErrorEventBus}
      tokenStorage={tokenStorage}
    >
      <App
        kakao={kakao}
        kakaoService={kakaoService}
        partyService={partyService}
        chatService={chatService}
        authService={authService}
      />
      </AuthProvider>
      </CSSTransition>
    </TransitionGroup>
  </BrowserRouter>,

  document.getElementById('root')
);
