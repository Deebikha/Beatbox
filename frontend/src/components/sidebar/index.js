import React, { useState, useEffect } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import apiClient from "../../spotify";

export default function Sidebar() {
  const [ image , setImage] = useState(
    "https://th.bing.com/th/id/OIP.d_uswl820zrfnXGgCN4V1gHaEK?w=272&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  );
  useEffect(() => {
    apiClient.get("me").then((response) => { 
      if (response.data.images.length > 0) {
        setImage(response.data.images[0].url);
      }
    });
  }, []);
  return (
    <div className="sidebar-container">
      <img src={ image } className="profile-img" alt="profile" />
      <div>
        <SidebarButton title="Feed" to="/feed" icon={<MdSpaceDashboard />} />
        <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} /> 
        <SidebarButton
          title="Favorites"
          to="/favourites"
          icon={<MdFavorite />}
        />
        <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
      </div>
      <SidebarButton title="Sign Out" to="/signout" icon={<FaSignOutAlt />} />
    </div>
  );
}
