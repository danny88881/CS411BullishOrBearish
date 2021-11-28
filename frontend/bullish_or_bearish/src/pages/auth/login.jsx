import React, { Component } from "react";
import axios from "axios";
import bcrypt from "bcryptjs"

async function hashIt(password){
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

// resource https://www.youtube.com/watch?v=AWLgf_xfd_w

export default class Login extends Component {
  constructor(props) {
    super(props);

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
    const pass = hashIt(this.state.password)
    const conf = hashIt(this.state.password_confirmation)
    if (pass == conf) {
      axios.post('http://localhost:3002/api/register', {first_name: this.state.first_name, last_name: this.state.last_name, email: this.state.email, password: this.password.email},
      { withCredentials: true }).then(
        response => {console.log("registration reg", response);}
      ).catch(error => {console.log("registration error", error);})
    } else {
      this.setState({loginError: false})
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.setState({loginError: false})
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
        <h3 style={{display: this.state.loginError ? "block" : "none", color:"#ff0000"}}>login error</h3>
        </form>
      </div>
    );
  }
}