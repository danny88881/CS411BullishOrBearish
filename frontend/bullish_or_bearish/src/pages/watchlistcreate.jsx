import React, { Component } from "react";
import axios from "axios";
import bcrypt from "bcryptjs"

function redir() {
    const userId = localStorage.getItem('userId')
    if (userId == 'undefined' || userId == null) {
      document.location.href = "/Login";
    } else {
      console.log("OK")
    }
}

export default class WatchListCreate extends Component {
    constructor(props) {
      super(props);
      redir();
      this.state = {
        title: "",
        description: "",
      }
  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      axios.post('http://localhost:3002/api/WatchlistCreate', {
        creatorid: localStorage.getItem('userId'), time: date, title: this.state.title, desc: this.state.description
      }).then((res)=> {
        document.location.href = "/WatchLists";
    });
    }
  
    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
      this.setState({registration_errors: false});
    }
  
    render () {
      return (
        <div class="register">
          <form class="create" onSubmit={this.handleSubmit}>
          <h1>create watchlist</h1>
          <p>--------------------</p>
          <input type="text" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange} required/>
          <input type="text" name="description" placeholder="description" value={this.state.description} onChange={this.handleChange} required/>
          <button type="submit" disabled={false}>create</button>
          <h3 style={{display: this.state.registration_errors ? "block" : "none", color:"#ff0000"}}>error occured during registration</h3>
          </form>
        </div>
      );
    }
  }