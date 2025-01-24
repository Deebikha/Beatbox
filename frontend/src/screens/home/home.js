import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { setClientToken } from "../../spotify";
import Library from "../library/library";
import Player from "../player/player";
import Feed from "../feed/feed";
import Favourites from "../favourites/favourites";
import TrendingPage from "../trending/trending";
import ArtistPage from "../artist/artist";
import SignOut from "../signout/signout";
import Front from "../front/front";
import LoginForm from "../login/login";
import Signup from "../signup/signup";
import Sidebar from "../../components/sidebar";
import "./home.css";

export default function Home() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const hash = window.location.hash;
    let token = localStorage.getItem("token");

    if (!token && hash) {
      token = new URLSearchParams(hash.substring(1)).get("access_token");

      if (token) {
        localStorage.setItem("token", token);
        window.location.hash = "";
        setClientToken(token);
      }
    }

    if (token) {
      setToken(token);
      setClientToken(token);
    }
  }, []);

  return (
    <div className="main-body">
      {token && <Sidebar />} 
      <Routes>
        <Route path="/" element={!token ? <Front /> : <Navigate to="/library" />} />
        <Route path="/login" element={!token ? <LoginForm /> : <Navigate to="/library" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/library" />} />
        <Route path="/library" element={token ? <Library /> : <Navigate to="/" />} />
        <Route path="/feed" element={token ? <Feed /> : <Navigate to="/" />} />
        <Route path="/trending" element={token ? <TrendingPage /> : <Navigate to="/" />} />
        <Route path="/player" element={token ? <Player /> : <Navigate to="/" />} />
        <Route path="/favourites" element={token ? <Favourites /> : <Navigate to="/" />} />
        <Route path="/artist/:id" element={token ? <ArtistPage /> : <Navigate to="/" />} />
        <Route path="/signout" element={token ? <SignOut /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}
