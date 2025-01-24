import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./trending.css";
import apiClient from "../../spotify";

const TrendingPage = () => {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingAlbums();
  }, []);

  const fetchTrendingAlbums = async () => {
    try {
      const res = await apiClient.get("browse/new-releases");
      const newAlbums = res.data.albums.items;

      const albumsWithTracks = await Promise.all(
        newAlbums.map(async (album) => {
          const tracksRes = await apiClient.get(`albums/${album.id}/tracks`);
          return {
            ...album,
            tracks: tracksRes.data.items,
          };
        })
      );

      setAlbums(albumsWithTracks);
    } catch (error) {
      console.error("Error fetching new releases:", error);
    }
  };

  const handlePlayClick = (album) => {
    navigate("/player", { state: { tracks: album.tracks, currentTrack: album.tracks[0], album } });
  };

  return (
    <div className="screen-container">
      <div className="trending-library-body">
        {albums.map((album) => (
          <div key={album.id} className="trending-playlist-card" onClick={() => handlePlayClick(album)}>
            <div className="trending-playlist-image-container">
              <img
                src={album.images[0]?.url}
                alt={album.name}
                className="trending-playlist-image"
              />
              <IconContext.Provider
                value={{
                  size: "50px",
                  color: "#E99D72",
                  className: "trending-play-button",
                }}
              >
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
            <div className="trending-playlist-title">{album.name}</div>
            <div className="trending-playlist-subtitle">
              {album.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
