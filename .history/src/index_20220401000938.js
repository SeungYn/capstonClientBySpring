import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TokenStorage from './db/token';
import HttpClient from './network/http';
import { AuthErrorEventBus, AuthProvider } from './context/AuthContext';
import AuthService from './service/auth';
import { BrowserRouter } from 'react-router-dom';

const baseURL = 'https://93f84493c6005a.lhrtunnel.link';
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService(httpClient, tokenStorage);
const { kakao } = window;
ReactDOM.render(
  <BrowserRouter>
    <AuthProvider
      authService={authService}
      authErrorEventBus={authErrorEventBus}
    >
      <App kakao={kakao} />
    </AuthProvider>
  </BrowserRouter>,

  document.getElementById('root')
);
