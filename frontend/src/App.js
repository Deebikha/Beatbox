import React, { useEffect } from "react";
import Home from "./screens/home/home";


export default function App() {
  useEffect(() => {
    
    document.title = "BeatBox";

   
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(icon => icon.remove());

    
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/bb.jpeg';  

   
    document.head.appendChild(link);

    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
}
