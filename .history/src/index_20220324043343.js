import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
const { kakao } = window;

ReactDOM.render(
  <React.StrictMode>
    <App kakao={kakao} />
  </React.StrictMode>,
  document.getElementById('root')
);
