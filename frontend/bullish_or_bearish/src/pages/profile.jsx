import React, { Component } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink
} from "react-router-dom"

function redir() {
  const userId = localStorage.getItem('userId')
  if (userId == 'undefined') {
    document.location.href = "/Login";
  } else {
    console.log("OK")
  }
}

export default class Profile extends Component {
  constructor(){
    super();
    redir();
    this.getUserData = this.getUserData.bind(this);
    this.state={
      first_name:"",
      last_name:"",
      email:"",
      join_date:""
    }
    this.getUserData()
    this.logout = this.logout.bind(this);
  }

  async getUserData() {
    const userId = localStorage.getItem('userId')
    axios.get('http://localhost:3002/api/getUserData', {params:{UserId: userId}}).then(
      response => {
        console.log(response)
        this.setState({first_name: response.data[0].FirstName});
        this.setState({last_name: response.data[0].LastName});
        this.setState({email: response.data[0].Email});
        this.setState({join_date: response.data[0].JoinDate});
      }
    )
  }

  logout() {
    localStorage.setItem('userId', 'undefined')
    document.location.href = "/";
  }

  render () {
    return (
      <div class="profile">
      <h1>hi! {this.state.first_name} {this.state.last_name}</h1>
      <h2>{this.state.email}</h2>
      <h2>you joined : {this.state.join_date}</h2>
      <button onClick={this.logout}>loGout</button>
      </div>
    );
  }
}