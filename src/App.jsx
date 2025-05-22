
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import NavbarMusic from '@/components/music/NavbarMusic';
import FooterMusic from '@/components/music/FooterMusic';
import MusicHomePage from '@/pages/MusicHomePage';
import MusicGenrePage from '@/pages/MusicGenrePage';
import MusicArtistPage from '@/pages/MusicArtistPage';
import MusicAlbumPage from '@/pages/MusicAlbumPage';
import MusicSearchPage from '@/pages/MusicSearchPage';
import MusicPlayerBar from '@/components/music/MusicPlayerBar';
import NotFoundPage from '@/pages/NotFoundPage';
import { AudioProvider } from '@/contexts/AudioContext';

const App = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <NavbarMusic />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<MusicHomePage playSong={playSong} />} />
              <Route path="/genre/:genreName" element={<MusicGenrePage playSong={playSong} />} />
              <Route path="/artist/:artistId" element={<MusicArtistPage playSong={playSong} />} />
              <Route path="/album/:albumId" element={<MusicAlbumPage playSong={playSong} />} />
              <Route path="/search/:query" element={<MusicSearchPage playSong={playSong} />} />
              <Route path="/search" element={<MusicSearchPage playSong={playSong} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <MusicPlayerBar />
          <FooterMusic />
          <Toaster />
        </div>
      </Router>
    </AudioProvider>
  );
};

export default App;
