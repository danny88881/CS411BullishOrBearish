import React, { Component } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink
} from "react-router-dom"
import bull from "../bull.png"
import bear from "../bear.png"

function redir() {
  const userId = localStorage.getItem('userId')
  if (userId == 'undefined' || userId == null) {
    document.location.href = "/Login";
  } else {
    console.log("OK")
  }
}

export default class Watchlists extends Component {
  constructor() {
    super();
    redir();
    this.favorites();
    this.others();
    this.favorites = this.favorites.bind(this);
    this.others = this.others.bind(this);
    this.favorite = this.favorite.bind(this);
    this.state={
      favorites:[],
      others:[]
    }
  }

  favorites = () => {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/getFavoriteLists', {params:{UserId: userId}}).then(
      response => {
        this.setState({favorites: response.data});
      }
    )
  }

  others = () => {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/watchlist', {params:{UserId: userId}}).then(
      response => {
        this.setState({others: response.data});
      }
    );
  }

  favorite = (ListId) => {
    const userId = localStorage.getItem('userId')
    axios.post('http://localhost:3002/api/favoritewatchlist', {UserId: userId, ListId: ListId}).then(
      (response) => {
        this.favorites();
        this.others();
      }
    );
  }

  unfavorite = (ListId) => {
    const userId = localStorage.getItem('userId')
    axios.post('http://localhost:3002/api/unfavoritewatchlist', {UserId: userId, ListId: ListId}).then(
      (response) => {
        this.favorites();
        this.others();
      }
    );
  }  

  render () {
    return (
      <div class="menu">
        <div class="createwatchlist" onClick={() => {document.location.href = "/CreateWatchlist"}}>
          <button>create a wAtchlist</button>
        </div>
        <hr></hr>
        <h1>your favorite wAtchlists</h1>
        {this.state.favorites &&
         this.state.favorites.map((favorite) =>
           <div>
             <div class="viewwatchlist" onClick={() => {document.location.href = "/WatchLists/" + favorite['ListId']}}>
               <h1>{favorite['Title']}</h1>
               <p>{favorite['Description'].toLowerCase()}</p>
             </div>
             <button class="addButton" type="button" onClick={()=>{this.unfavorite(favorite['ListId'])}}>unfavorite</button>  
           </div>
         )}
        <hr></hr>
        <h1>discover new wAtchlists</h1>
        {this.state.others &&
         this.state.others.map((other) =>
           <div>
             <div class="viewwatchlist" onClick={() => {document.location.href = "/WatchLists/" + other['ListId']}}>
               <h1>{other['Title']}</h1>
               <p>{other['Description'].toLowerCase()}</p>
             </div>
             <button class="addButton" type="button" onClick={()=>{this.favorite(other['ListId'])}}>favorite this</button>
           </div>
         )}
      </div>
    );
  }
}
