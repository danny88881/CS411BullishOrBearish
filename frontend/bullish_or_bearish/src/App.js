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
import Home from './pages/home';
import Stocks from './pages/stocks';
import Stock from './pages/stock';
import Search from './pages/search';
import WatchLists from './pages/watchlists';
import WatchList from './pages/watchlist';
import WatchListCreate from './pages/watchlistcreate';

class App extends Component {
  render() {
    return(
    <>
    <ToolBar />
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Registration" element={<Registration/>} />
      <Route path="/Stocks" element={<Stocks/>} />
      <Route path="/Stocks/:symbol" element={<Stock/>} />
      <Route path="/Watchlists" element={<WatchLists/>} />
      <Route path="/CreateWatchlist" element={<WatchListCreate/>} />
      <Route path="/Watchlists/:listid" element={<WatchList/>} />
      <Route path="/Search" element={<Search/>} />
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
