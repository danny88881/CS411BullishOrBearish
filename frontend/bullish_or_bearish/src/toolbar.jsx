import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink
} from "react-router-dom"

var logged_in = false

function ToolBar() {

  return (
    <div class="ToolBar">
      <ul>
        <li class="noselect"><NavLink to="/" className={(navData) => navData.isActive ? "Active" : ""}>Bulllish or Bearish</NavLink></li>
        <li class="noselect" style={{display:logged_in?"block":"none"}}>:</li>
        <li class="noselect"><NavLink style={{display:logged_in?"block":"none"}} to="/Stocks" className={(navData) => navData.isActive ? "Active" : ""}>stocKs</NavLink></li>
        <li class="noselect" style={{display:logged_in?"block":"none"}}>:</li>
        <li class="noselect"><NavLink style={{display:logged_in?"block":"none"}} to="/Watchlists" className={(navData) => navData.isActive ? "Active" : ""}>wAtchlists</NavLink></li>
        <li class="noselect" style={{display:logged_in?"block":"none"}}>:</li>
        <li class="noselect"><NavLink style={{display:logged_in?"block":"none"}} to="/Search" className={(navData) => navData.isActive ? "Active" : ""}>seaRch</NavLink></li>
        <li class="noselect"><NavLink to={logged_in?"/Profile":"/Register"} className={(navData) => navData.isActive ? "Active" : ""}>profilE</NavLink></li>
      </ul>
    </div>
  )

}

export default ToolBar