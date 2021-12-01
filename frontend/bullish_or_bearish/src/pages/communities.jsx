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

export default class Communities extends Component {
  constructor() {
    super();
    redir();
    this.users()
    this.others();
    this.users = this.users.bind(this);
    this.others = this.others.bind(this);
    this.join = this.join.bind(this);
    this.leave = this.leave.bind(this);
    this.state={
      users:[],
      others:[]
    }
  }

  users = () => {
    axios.get('http://localhost:3002/api/usercommunities', {
      params: {userId: localStorage.getItem("userId")}
    }).then((res)=> {
      console.log(res);
      this.setState({users: res.data});
    });
  };

  others = () => {
    axios.get('http://localhost:3002/api/othercommunities', {
      params: {userId: localStorage.getItem("userId")}
    }).then((res)=> {
      console.log(res);
      this.setState({others: res.data});
    });
  };

  join = (communityId) => {
    axios.post('http://localhost:3002/api/joincommunity', {
      userId: localStorage.getItem("userId"), communityId: communityId
    }).then((res)=> {
      this.users();
      this.others();
    });
  }

  leave = (communityId) => {
    axios.post('http://localhost:3002/api/leavecommunity', {
      userId: localStorage.getItem("userId"), communityId: communityId
    }).then((res)=> {
      this.users();
      this.others();
    });
  }

  // useEffect(() => {
  //   axios.get('http://localhost:3002/api/usercommunities', {
  //     params: {userId: localStorage.getItem("userId")}
  //   }).then((res)=> {
  //     console.log(res);
  //     setUserCommunities(res.data);
  //   });

  //   axios.get('http://localhost:3002/api/othercommunities', {
  //     params: {userId: localStorage.getItem("userId")}
  //   }).then((res)=> {
  //     console.log(res);
  //     setOtherCommunities(res.data);
  //   });
  // }, []);

  render() {
    return (
      <div>
        <h1>your communities</h1>
        {this.state.users &&
         this.state.users.map((community) =>
           <div>
             <div onClick={() => {document.location.href = "/Communities/" + community['CommunityId']}}>
               <h1>Name: {community['Name']}</h1>
               <p>Description: {community['Description'].toLowerCase()}</p>
             </div>
             <button type="button" onClick={() =>{this.leave(community['CommunityId'])}}>leave</button>    
           </div>       
         )}
        <hr></hr>
        <h1>discover other communities</h1>
        {this.state.others &&
         this.state.others.map((community) =>
           <div>
             <div onClick={() => {document.location.href = "/Communities/" + community['CommunityId']}}>
               <h1>Name: {community['Name']}</h1>
               <p>Description: {community['Description'].toLowerCase()}</p>
             </div>
             <button type="button" onClick={() =>{this.join(community['CommunityId'])}}>join</button>    
           </div>       
         )}
      </div>
    );
  }
}

