import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./widgets.css";

import WidgetCard from "./widgetCard";
import apiClient from "../../spotify";

export default function Widgets({ artistID }) {
  const [similar, setSimilar] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newRelease, setNewRelease] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistID) {
          const relatedArtistsRes = await apiClient.get(`/artists/${artistID}/related-artists`);
          const relatedArtists = relatedArtistsRes.data?.artists.slice(0, 3);
          setSimilar(relatedArtists);

          const featuredPlaylistsRes = await apiClient.get(`/browse/featured-playlists`);
          const featuredPlaylists = featuredPlaylistsRes.data?.playlists.items.slice(0, 3);
          setFeatured(featuredPlaylists);

          const newReleasesRes = await apiClient.get(`/browse/new-releases`);
          const newReleases = newReleasesRes.data?.albums.items.slice(0, 3);
          setNewRelease(newReleases);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [artistID]);

  const handleCardClick = () => {
    navigate('/feed', { state: { similarArtists: similar, newReleases: newRelease, madeForYou: featured } });
  };

  const handleNewReleaseClick = (album) => {
    

      navigate('/trending', { state: { newReleases: newRelease} });
    
  };

  return (
    <div className="widgets-body flex">
      <WidgetCard title="Similar Artists" items={similar} onCardClick={handleCardClick} />
      <WidgetCard title="Made For You" items={featured} onCardClick={handleCardClick} />
      <WidgetCard title="New Releases" items={newRelease} onCardClick={handleNewReleaseClick} />
    </div>
  );
}
