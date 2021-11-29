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

// resource https://www.youtube.com/watch?v=AWLgf_xfd_w

export default class Registration extends Component {
  constructor(props) {
    super(props);
    redir();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      passwords_match: true,
      registration_errors: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.password == this.state.password_confirmation) {
      const hashedPassword = bcrypt.hashSync(this.state.password, '$2a$10$CwTycUxWue0Ohq9StjUM0u')
      axios.post('http://localhost:3002/api/register', {first_name: this.state.first_name, last_name: this.state.last_name, email: this.state.email, password: hashedPassword}
      ).then(
        response => {
          console.log("registration reg", response);
          if(response.data.code) {
            this.setState({registration_errors: true});
          } else {
            axios.get('http://localhost:3002/api/getId', {params:{email: this.state.email}}).then(
              response => {
                if (response.data.length > 0) {
                  localStorage.setItem('userId', response.data[0].UserId)
                  document.location.href = "/Profile";
                }
              }
            )
          }
        }
      ).catch(
        error => {
          console.log("registration error", error);
          this.setState({registration_errors: true});
        }
        )
    } else {
      this.setState({passwords_match: false})
      this.setState({registration_errors: false});
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.setState({passwords_match: true})
    this.setState({registration_errors: false});
  }

  render () {
    return (
      <div>
        <form class="register" onSubmit={this.handleSubmit}>
        <h1>register</h1>
        <p>--------------------</p>
        <input type="text" name="first_name" placeholder="first name" value={this.state.first_name} onChange={this.handleChange} required/>
        <input type="text" name="last_name" placeholder="last name" value={this.state.last_name} onChange={this.handleChange} required/>
        <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} required/>
        <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required/>
        <input type="password" name="password_confirmation" placeholder="password again" value={this.state.password_confirmation} onChange={this.handleChange} required/>
        <button type="submit" disabled={!this.state.passwords_match}>register</button>
        <h3 style={{display: this.state.passwords_match ? "none" : "block", color:"#ff0000"}}>passwords do not match</h3>
        <h3 style={{display: this.state.registration_errors ? "block" : "none", color:"#ff0000"}}>error occured during registration</h3>
        </form>
      </div>
    );
  }
}