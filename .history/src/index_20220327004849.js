import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TokenStorage from './db/token';
import HttpClient from './network/http';
import { AuthErrorEventBus } from './context/AuthContext';
import AuthService from './service/auth';

const baseURL = 'a';
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService(httpClient, tokenStorage);

ReactDOM.render(
  <App />,

  document.getElementById('root')
);
