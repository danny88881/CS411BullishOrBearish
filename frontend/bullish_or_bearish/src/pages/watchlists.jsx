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

export default class WatchList extends Component {
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
    axios.post('http://localhost:3002/api/getFavoriteLists', {params:{UserId: userId}}).then(
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
    axios.post('http://localhost:3002/api/watchlist', {params:{UserId: userId}}).then(
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

  render () {
    return (
      <div>
        <h1>WatchList Favorites</h1>
        {this.state.favorites &&
         this.state.favorites.map((favorite) =>
           <div>
             <h1>Name: {favorite['Title']}</h1>
             <p>Description: {favorite['Description'].toLowerCase()}</p>
             <p>Creator: {favorite['CreatorId']}</p>
           </div>
         )}
        <h1>New WatchLists</h1>
        {this.state.others &&
         this.state.others.map((other) =>
           <div>
             <h1>Name: {other['Title']}</h1>
             <p>Description: {other['Description'].toLowerCase()}</p>
             <p>Creator: {other['CreatorId']}</p>
             <button type="button" onClick={this.favorite(other['ListId'])}>favorite this</button>
           </div>
         )}
      </div>
    );
  }
}