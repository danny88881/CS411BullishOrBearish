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

  favorites() {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/getFavoriteLists', {params:{UserId: userId}}).then(
      response => {
        console.log(response)
        if (response.data.length > 0) {
          this.setState({favorites: response.data});
        }
      }
    )
  }

  others() {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/watchlist', {params:{UserId: userId}}).then(
      response => {
        console.log(response)
        if (response.data.length > 0) {
          this.setState({others: response.data});
        }
      }
    );
  }

  favorite(ListId) {
    const userId = localStorage.getItem('userId')
    axios.post('http://localhost:3002/api/favoritewatchlist', {UserId: userId, ListId: ListId}).then(
      this.favorites(),
      this.others()
    );
  }

  unfavorite(ListId) {
    const userId = localStorage.getItem('userId')
    axios.post('http://localhost:3002/api/unfavoritewatchlist', {UserId: userId, ListId: ListId}).then(
      this.favorites(),
      this.others()
    );
  }  

  render () {
    return (
      <div>
        <div class="createwatchlist" onClick={() => {document.location.href = "/CreateWatchlist"}}>
          <h1>create watchlist</h1>
        </div>
        <hr></hr>
        <h1>your watchList favorites</h1>
        {this.state.favorites &&
         this.state.favorites.map((favorite) =>
           <div>
             <div class="viewwatchlist" onClick={() => {document.location.href = "/WatchLists/" + favorite['ListId']}}>
               <h1>Name: {favorite['Title']}</h1>
               <p>Description: {favorite['Description'].toLowerCase()}</p>
               <p>Creator: {favorite['CreatorId']}</p>
             </div>
             <button type="button" onClick={()=>{this.unfavorite(favorite['ListId'])}}>unfavorite this</button>  
           </div>
         )}
        <hr></hr>
        <h1>discover new Watchlists</h1>
        {this.state.others &&
         this.state.others.map((other) =>
           <div>
             <div class="viewwatchlist" onClick={() => {document.location.href = "/WatchLists/" + other['ListId']}}>
               <h1>Name: {other['Title']}</h1>
               <p>Description: {other['Description'].toLowerCase()}</p>
               <p>Creator: {other['CreatorId']}</p>
             </div>
             <button type="button" onClick={()=>{this.favorite(other['ListId'])}}>favorite this</button>
           </div>
         )}
      </div>
    );
  }
}
