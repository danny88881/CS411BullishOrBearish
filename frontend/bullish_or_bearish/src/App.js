import './App.css';
import React, { Component, useState, useEffect } from "react";
import Axios from 'axios';

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"

//Pages
import ToolBar from './toolbar'
import ErrorPage from './pages/errorpage';
import Registration from './pages/auth/register';
import Login from './pages/auth/login';
import Profile from './pages/profile';

import Stocks from './pages/stocks';

class App extends Component {
  render() {
    return(
    <>
    <ToolBar />
    <Routes>
      <Route path="/" />
      <Route path="/Registration" element={<Registration/>} />
      <Route path="/Stocks" element={<Stocks/>} />
      <Route path="/Watchlists" element={<Registration/>} />
      <Route path="/Search" element={<Registration/>} />
      <Route path="/Register" element={<Registration/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Profile" element={<Profile/>} />
      <Route path="/404" element={<ErrorPage/>}/>
      <Route path="*" element={<Navigate replace to="404"/>} />
    </Routes>
    </>
    );
  }
}

export default App;
