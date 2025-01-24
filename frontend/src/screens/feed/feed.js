import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from 'react-icons/ai';
import "./feed.css";
import apiClient from '../../spotify';

const Feed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { similarArtists = [], madeForYou = [] } = location.state || [];
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    
    const fetchSimilarArtists = async () => {
      try {
        const artistsPromises = similarArtists.map(async (artist) => {
          const response = await apiClient.get(`/artists/${artist.id}/top-tracks?market=US`);
          return response.data.tracks;
        });
        const tracks = await Promise.all(artistsPromises);
        setTopTracks(tracks.flat()); 
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    if (similarArtists.length > 0) {
      fetchSimilarArtists();
    }
  }, [similarArtists]);

  
  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`, { state: { artist } });
  };

  const handlePlaylistClick = (playlist) => {
    navigate('/player', { state: { playlist } });
  };

  return (
    <div className='screen-container'>
      <div className="feed-section">
        <h2>Similar Artists</h2>
        <div className="feed-items">
          {similarArtists.map((artist) => (
            <div key={artist.id} className="feed-item"
              onClick={() => handleArtistClick(artist)}
            >
              <img src={artist.images[2]?.url} alt={artist.name} />
              <div className="custom-play-button-overlay">
                <IconContext.Provider value={{ className: "custom-trending-play-button" }}>
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </div>
              <p>{artist.name}</p>
              <p>{artist.followers.total} Followers</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="feed-section">
        <h2>Made For You</h2>
        <div className="feed-items">
          {madeForYou.map((playlist) => (
            <div key={playlist.id} className="feed-item"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <img src={playlist.images[0]?.url} alt={playlist.name} />
              <div className="custom-play-button-overlay">
                <IconContext.Provider value={{ className: "custom-trending-play-button" }}>
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </div>
              <p>{playlist.name}</p>
              <p>{playlist.tracks.total} Songs</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
