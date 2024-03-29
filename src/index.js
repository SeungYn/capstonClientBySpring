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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HttpClientAxios from './network/httpAxios';

const { kakao } = window;
const baseURL = 'https://dd290981c7fc4b.lhr.life'; //process.env.REACT_APP_BASE_URL; //process.env.REACT_APP_BASE_URL; //process.env.REACT_APP_BASE_URL;  //'http://localhost:8080';
const tokenStorage = new TokenStorage();
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL);
const authService = new AuthService(httpClient, tokenStorage);
const stompClient = new StompDI(baseURL, () => tokenStorage.getToken());
const kakaoService = new KakaoService(httpClient, tokenStorage, kakao);
const partyService = new PartyService(httpClient, tokenStorage);
const chatService = new ChatService(httpClient, tokenStorage, stompClient);

const queryClient = new QueryClient();
console.log('index');
ReactDOM.render(
  <BrowserRouter basename='/capstonClientBySpring'>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </BrowserRouter>,

  document.getElementById('root')
);
