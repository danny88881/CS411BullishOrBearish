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

export default class Home extends Component {
  constructor(){
    super();
    redir();

    this.state = {
      symbol: "",
      name: "",
      sector: "",
      industry: ""
    };

    this.rand_stock = this.rand_stock.bind(this);
    this.vote = this.vote.bind(this);
    this.rand_stock();
  }

  rand_stock() {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/getUnvoted', {params:{UserId: userId}}).then(
      response => {
        if (response.data.length > 0) {
          const index = Math.floor(Math.random() * response.data.length);
          this.setState({symbol: response.data[index].Symbol.toLowerCase()});
          axios.post('http://localhost:3002/api/stock/search', {stockSymbol: response.data[index].Symbol}).then(
            response => {
              if (response.data.length > 0) {
                this.setState({name: response.data[0].Name});
                this.setState({sector: response.data[0].Sector});
                this.setState({industry: response.data[0].Industry});
              }
            }
          );
        }
      }
    );
  }

  vote(bullish) {
    const userId = localStorage.getItem('userId')
    axios.post('http://localhost:3002/api/vote', {UserId: userId, Symbol: this.state.symbol, Bullish: bullish}).then(
      this.rand_stock()
    );
  }

  render () {
    return (
      <div class="home">
        <img class="bull" src={bull} onClick={() => this.vote(true)}/>
        <div class="inner">
          <h1>{this.state.symbol}</h1>
          <h2>{this.state.sector} : {this.state.industry}</h2>
        </div>
        <img class="bear" src={bear} onClick={() => this.vote(false)}/>
        
        {/**
          <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        */}
      </div>
    );
  }
}