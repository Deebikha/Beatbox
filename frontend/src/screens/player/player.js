import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../spotify';
import SongCard from '../../components/songCard';
import Queue from '../../components/queue';
import Widgets from '../../components/widgets';
import AudioPlayer from '../../components/audioPlayer';
import './player.css';

const Player = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    const fetchTracks = async () => {
      try {
        console.log('Location State:', location.state);

        if (!location.state) {
          console.error('No location state provided');
          return;
        }

        if (location.state.track) {
          setTracks([location.state.track]);
          setCurrentTrack(location.state.track);
          setCurrentIndex(0);
        } else if (location.state.tracks) {
          setTracks(location.state.tracks);
          setCurrentTrack(location.state.tracks[0] || {});
          setCurrentIndex(0);
        } else if (location.state.playlist) {
          const { playlist } = location.state;

          if (playlist.tracks && playlist.tracks.href) {
            try {
              const res = await apiClient.get(`playlists/${playlist.id}/tracks`);
              const tracksData = res.data?.items?.map((item) => item.track) || [];
              setTracks(tracksData);
              setCurrentTrack(tracksData[0] || {});
              setCurrentIndex(0);
              if (tracksData[0]?.album?.artists[0]?.id) {
                fetchSimilarArtists(tracksData[0].album.artists[0].id);
              }
            } catch (error) {
              console.error('Error fetching playlist tracks:', error);
            }
          } else if (Array.isArray(playlist.tracks)) {
            setTracks(playlist.tracks);
            setCurrentTrack(playlist.tracks[0] || {});
            setCurrentIndex(0);
            if (playlist.tracks[0]?.album?.artists[0]?.id) {
              fetchSimilarArtists(playlist.tracks[0].album.artists[0].id);
            }
          } else {
            console.error('Invalid playlist data:', playlist);
            setTracks([]);
            setCurrentTrack({});
            setCurrentIndex(0);
          }
        } else if (location.state.id) {
          try {
            const res = await apiClient.get(`playlists/${location.state.id}/tracks`);
            const tracksData = res.data?.items?.map((item) => item.track) || [];
            setTracks(tracksData);
            setCurrentTrack(tracksData[0] || {});
            setCurrentIndex(0);
          } catch (error) {
            console.error('Error fetching playlist tracks:', error);
          }
        } else if (location.state.artistId) {
          try {
            const res = await apiClient.get(`artists/${location.state.artistId}/top-tracks?market=US`);
            const tracksData = res.data?.tracks || [];
            setTracks(tracksData);
            setCurrentTrack(tracksData[0] || {});
            setCurrentIndex(0);
            fetchSimilarArtists(location.state.artistId);
          } catch (error) {
            console.error('Error fetching artist top tracks:', error);
          }
        } else if (location.state.trendingData) {
          setTracks(location.state.trendingData);
          setCurrentTrack(location.state.trendingData[0] || {});
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, [location.state]);

  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[currentIndex]);
    }
  }, [currentIndex, tracks]);

  const addToFavorites = () => {
    if (currentTrack && !favorites.some((track) => track.id === currentTrack.id)) {
      const newFavorites = [...favorites, currentTrack];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      console.log('Added to favorites:', currentTrack.name);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < tracks.length - 1 ? prevIndex + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? tracks.length - 1 : prevIndex - 1));
  };

  const fetchSimilarArtists = async (artistId) => {
    if (artistId) {
      try {
        const res = await apiClient.get(`artists/${artistId}/related-artists`);
        setSimilarArtists(res.data?.artists || []);
      } catch (error) {
        console.error('Error fetching similar artists:', error);
      }
    }
  };

  const handleArtistClick = (artistId) => {
    navigate(`/player`, { state: { artistId } });
  };

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          total={tracks}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
        {currentTrack.album && (
          <Widgets artistID={currentTrack.album.artists[0]?.id} />
        )}

        {location.state && location.state.artistId && (
          <div className="similar-artists">
            <h2>Similar Artists</h2>
            <div className="similar-artists-list">
              {similarArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="similar-artist"
                  onClick={() => handleArtistClick(artist.id)}
                >
                  <img src={artist.images[2]?.url} alt={artist.name} />
                  <p>{artist.name}</p>
                  <p>{artist.followers.total} Followers</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="right-player-body">
        <SongCard album={currentTrack.album || location.state.album} key={currentTrack.id} />
        <button className="favorite-button" onClick={addToFavorites}>
          Add to Favorites
        </button>
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
};

export default Player;
