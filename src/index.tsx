import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './App';
import reportWebVitals from './reportWebVitals';

const newVariable = document.getElementById('root')
 if (! newVariable) {throw new Error("newVariable is null")} 
const root = ReactDOM.createRoot(newVariable);

root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
