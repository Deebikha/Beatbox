import React from 'react';
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from 'react-icons/ai';
import './playlistcard.css';

const PlaylistCard = ({ playlist, artistName, onClick }) => {
  return (
    <div className="card-container" onClick={onClick}>
      <div className="image-container">
        <img src={playlist.images[0]?.url} alt={playlist.name} className="card-image" />
        <IconContext.Provider value={{ size: "50px", color: "#E99D72", className: "trending-play-button" }}>
          <AiFillPlayCircle />
        </IconContext.Provider>
      </div>
      <div className="info-container">
        <h3>{artistName} {playlist.name}</h3>
        <p>{playlist.tracks.length} tracks</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
