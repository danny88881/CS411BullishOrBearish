import React, { Component } from "react";
import axios from "axios";
import bcrypt from "bcryptjs"

function redir() {
  const userId = localStorage.getItem('userId')
  if (userId == 'undefined' || userId == null) {
  } else {
    document.location.href = "/Profile";
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    redir();
    this.state = {
      email: "",
      password: "",
      loginError: false,
      errors: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const hashedPassword = bcrypt.hashSync(this.state.password, '$2a$10$CwTycUxWue0Ohq9StjUM0u')
    var conf = "";
    console.log(this.state.email);
    axios.get('http://localhost:3002/api/getPassword', {params:{email: this.state.email}}).then(
      response => {
        console.log(response);
        conf = response.data[0].Password;
        
        if (hashedPassword == conf) {
          axios.get('http://localhost:3002/api/getId', {params:{email: this.state.email}}).then(
            response => {
              localStorage.setItem('userId', response.data[0].UserId)
              document.location.href = "/Profile";
            }
          )
        } else {
          this.setState({loginError: true});
        }
      }
      
    ).catch(
      error => {
        console.log("login error", error);
        this.setState({loginError: true});
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.setState({loginError: false})
  }

  goToRegister() {
    document.location.href = '/Register'
  }

  render () {
    return (
      <div>
        <form class="register" onSubmit={this.handleSubmit}>
        <h1>login</h1>
        <p>--------------------</p>
        <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} required/>
        <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required/>
        <button type="submit" disabled={this.state.loginError}>login</button>
        <button type="button" onClick={this.goToRegister}>create account</button>
        <h3 style={{display: this.state.loginError ? "block" : "none", color:"#ff0000"}}>login error</h3>
        </form>
      </div>
    );
  }
}