import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './favourite.css';
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const playSong = (track) => {
    navigate('/player', { state: { track } });
  };

  return (
    <div className='screen-container'>
      <div className="library-body">
        {favorites.map((track, index) => (
          <div
            key={index}
            className="playlist-card"
            onClick={() => playSong(track)}
          >
            <img
              src={track?.album?.images[0]?.url}
              className="playlist-image"
              alt="Playlist-Art"
            />
            <p className="playlist-title">{track.name}</p>
            <p className="playlist-subtitle">{track.artists.map(artist => artist.name).join(", ")}</p>
            <div className="playlist-fade">
              <IconContext.Provider value={{ size: "50px", color: "#E99D72" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
