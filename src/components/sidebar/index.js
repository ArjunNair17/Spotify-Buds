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
        src="https://lh3.googleusercontent.com/M11Vmt8T6ikgNnNULGfW4qT5oXiWP4yObhnKAXCht9N1KgVc02fQc1GcCyFypvsy3to3wlGv8oG-qiy1G26B9kfm1qb4BnZ3WnWTx6gm" 
        className="profile-img" 
        alt="profile" 
      />
      <div>
        <SidebarButton title="Home" to="/home" icon={<AiOutlineHome />} />
        <SidebarButton title="Discover" to="/discover" icon={<RiCompassDiscoverLine />} />
        <SidebarButton title="Search" to="/search" icon={<BiSearchAlt />} />
      </div>
      <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />}/>
    </div>
  );
}