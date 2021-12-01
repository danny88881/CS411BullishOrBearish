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

export default class CommunityCreate extends Component {
    constructor(props) {
      super(props);
      redir();
      this.state = {
        name: "",
        description: "",
      }
  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      console.log({
        creatorid: localStorage.getItem('userId'), name: this.state.name, desc: this.state.description
      });
      axios.post('http://localhost:3002/api/communitycreate', {
        creatorid: localStorage.getItem('userId'), name: this.state.name, desc: this.state.description
      }).then((res)=> {
        document.location.href = "/Communities";
    });
    }
  
    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
      this.setState({registration_errors: false});
    }
  
    render () {
      return (
        <div>
          <form class="create" onSubmit={this.handleSubmit}>
          <h1>create community</h1>
          <p>--------------------</p>
          <input type="text" name="name" placeholder="name" value={this.state.name} onChange={this.handleChange} required/>
          <input type="text" name="description" placeholder="description" value={this.state.description} onChange={this.handleChange} required/>
          <button type="submit" disabled={false}>create</button>
          </form>
        </div>
      );
    }
  }
