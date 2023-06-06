import React from "react";
import {NavLink} from "react-router-dom";

const NavigationBar = () => {
    return (
      <div className = "NavigationBar">
        <header>
          <nav>
            <ul>
              <NavLink to='/'>
                 <li>Home</li>
              </NavLink>  
              <NavLink to='/profile'>
                 <li>Profile</li>
              </NavLink>               
            </ul>
          </nav>
        </header>
      </div>
  
    );
};

export default NavigationBar;