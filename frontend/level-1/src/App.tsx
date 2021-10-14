import React from 'react';
import logo from './logo.svg';
import './App.css';
import "tailwindcss/tailwind.css"

function App() {
  return (
    <div className="App text-center space-x-3 mx-auto pt-5 font-general">
      <div className="container mx-auto">
        <h1 className="title text-title font-bold">World population</h1>
        <h2 className="text-sup-title font-semibold">Ten most popular countries</h2>
        <div className="countries text-general font-bold">
          <div className="country ">
            <div className="country-name">world</div>
            <div></div>
            <div className="country-count">7 300 000</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
