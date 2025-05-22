
import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const mockSongsData = [
  { id: 'song1', title: 'Cosmic Dreamer', artist: 'Galaxy Beats', album: 'Stellar Grooves', duration: 185, genre: 'Electronic', year: 2023, audioSrc: '/audio/cosmic-dreamer.mp3', },
  { id: 'song2', title: 'Neon Nights', artist: 'Synthwave Rider', album: 'Retro Futures', duration: 220, genre: 'Synthwave', year: 2022, audioSrc: '/audio/neon-nights.mp3', },
  { id: 'song3', title: 'Purple Haze Remix', artist: 'Jimi Hendrix (Modernized)', album: 'Electric Ladyland Revisited', duration: 200, genre: 'Rock', year: 2024, audioSrc: '/audio/purple-haze.mp3', },
  { id: 'song4', title: 'Midnight Drive', artist: 'Lo-Fi Chillhop', album: 'City Vibes', duration: 150, genre: 'Lo-Fi', year: 2023, audioSrc: '/audio/midnight-drive.mp3', },
  { id: 'song5', title: 'Quantum Leap', artist: 'Future Sound Architects', album: 'Dimensions', duration: 240, genre: 'Trance', year: 2022, audioSrc: '/audio/quantum-leap.mp3',  },
  { id: 'song6', title: 'Velvet Groove', artist: 'Smooth Jazz Collective', album: 'Late Night Sessions', duration: 280, genre: 'Jazz', year: 2021, audioSrc: '/audio/velvet-groove.mp3', },
  { id: 'song7', title: 'Echoes in the Void', artist: 'Ambient Sphere', album: 'Soundscapes', duration: 320, genre: 'Ambient', year: 2023, audioSrc: '/audio/echoes-void.mp3',  },
  { id: 'song8', title: 'Rhythm of the Ancients', artist: 'Tribal Fusion Project', album: 'World Beats', duration: 190, genre: 'World', year: 2022, audioSrc: '/audio/rhythm-ancients.mp3',  },
];


export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      const updateProgress = () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      };
      const updateDuration = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };
      const handleEnded = () => {
        playNext();
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('loadedmetadata', updateDuration);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSong = useCallback((song, newPlaylist) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      const songIndex = newPlaylist.findIndex(s => s.id === song.id);
      setCurrentIndex(songIndex !== -1 ? songIndex : 0);
    } else if (playlist.length === 0) {
      setPlaylist([song]);
      setCurrentIndex(0);
    } else {
      const songIndex = playlist.findIndex(s => s.id === song.id);
      if (songIndex !== -1) {
        setCurrentIndex(songIndex);
      } else {
        setPlaylist(prev => [...prev, song]);
        setCurrentIndex(playlist.length);
      }
    }
    setCurrentSong(song);
  }, [playlist]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioSrc || `https://via.placeholder.com/600x400.mp3?text=${encodeURIComponent(currentSong.title)}`;
      audioRef.current.load();
      if (isPlaying) {
         audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
    }
  }, [currentSong]);


  const togglePlayPause = useCallback(() => {
    if (!currentSong && playlist.length > 0 && currentIndex !== -1) {
      setCurrentSong(playlist[currentIndex]);
    }

    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentSong, playlist, currentIndex]);

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (repeatMode === 'one' && isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      return;
    }

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= playlist.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        setCurrentSong(null); 
        setCurrentIndex(-1);
        setProgress(0);
        return;
      }
    }
    
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true); // Ensure playback starts for the next song
  }, [playlist, currentIndex, isShuffle, repeatMode, isPlaying]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;

    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex - 1;
    }

    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = playlist.length - 1;
      } else {
        setIsPlaying(false);
        setCurrentSong(null);
        setCurrentIndex(-1);
        setProgress(0);
        return;
      }
    }
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex, isShuffle, repeatMode]);
  
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const cycleRepeatMode = () => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const value = {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    playlist,
    currentIndex,
    isShuffle,
    repeatMode,
    playSong,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    playNext,
    playPrev,
    toggleShuffle,
    cycleRepeatMode,
    songsData: mockSongsData,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
