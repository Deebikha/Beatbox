import React from 'react';

function ListCard({ playlist, onClick }) {
  return (
    <div className="playlist-card" onClick={onClick}>
      <img src={playlist.images[0]?.url} alt={playlist.name} className="playlist-card-image" />
      <div className="playlist-card-content">
        <h3>{playlist.name}</h3>
        <p>{playlist.artists.map(artist => artist.name).join(", ")}</p>
      </div>
    </div>
  );
}

export default ListCard;
