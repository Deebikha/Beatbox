// In artist.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlaylistCard from './playlistcard';
import './artist.css';
import apiClient from '../../spotify';

function ArtistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artistName, setArtistName] = useState('');
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchArtistDetails();
    fetchArtistPlaylists();
  }, [id]);

  const fetchArtistDetails = () => {
    apiClient.get(`artists/${id}`)
      .then((res) => {
        setArtistName(res.data.name);
      })
      .catch((error) => {
        console.error('Error fetching artist details:', error);
      });
  };

  const fetchArtistPlaylists = () => {
    apiClient.get(`artists/${id}/top-tracks?market=US`)
      .then((res) => {
        const tracks = res.data.tracks;
        const formattedPlaylists = [{
          id: id,
          name: `${res.data.tracks[0]?.artists[0]?.name || ''}'s Top Tracks`,
          images: tracks.map(track => track.album.images[0]),
          tracks: tracks.slice(0, 30),
        }];
        setPlaylists(formattedPlaylists);
      })
      .catch((error) => {
        console.error('Error fetching artist playlists:', error);
      });
  };

  const handlePlaylistClick = (playlist) => {
    navigate('/player', { state: { playlist } });
  };

  return (
    <div className="screen-container flex">
      <h2>Artist Page for {artistName}</h2>
      <div className="artist-play-list">
        {playlists.map((playlist) => (
          <PlaylistCard 
            key={playlist.id} 
            playlist={playlist}
            artistName={artistName}
            onClick={() => handlePlaylistClick(playlist)}
          />
        ))}
      </div>
    </div>
  );
}

export default ArtistPage;
