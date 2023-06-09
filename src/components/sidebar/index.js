import React, { useState, useEffect } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { AiOutlineHome } from "react-icons/ai";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";


export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <img 
        src="https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/da2a63454352567f8bca0d37176b05a3~c5_720x720.jpeg?x-expires=1686391200&x-signature=xK3ofChx92HxXVPHw3QEKf4xjpQ%3D" 
        className="profile-img" 
        alt="profile" 
      />
      <div>
        <SidebarButton title="Home" to="/main" icon={<AiOutlineHome />} />
        <SidebarButton title="Discover" to="/discover" icon={<RiCompassDiscoverLine />} />
        <SidebarButton title="Search" to="/search" icon={<BiSearchAlt />} />
      </div>
      <div><SidebarButton title="Sign Out" to="/main" icon={<FaSignOutAlt />} /></div> 
    </div>
  );
}