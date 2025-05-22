
import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, PlusCircle, MoreHorizontal } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';

const SongCard = ({ song, onPlay, index, playlist }) => {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudio();
  const isActive = currentSong?.id === song.id;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      togglePlayPause();
    } else {
      playSong(song, playlist);
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className={`song-card group ${isActive ? 'border-primary/70 shadow-primary/40' : ''}`}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => playSong(song, playlist)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
        <img  
          alt={`Cover art for ${song.title} by ${song.artist}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={song.coverArt ? `/images/${song.coverArt}` : `https://picsum.photos/seed/${song.id}/300/300`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-16 h-16 text-white hover:bg-white/20 rounded-full"
            onClick={handlePlayClick}
            aria-label={isActive && isPlaying ? "Pause" : "Play"}
          >
            <PlayCircle size={48} strokeWidth={1.5} className={`${isActive && isPlaying ? 'fill-white' : ''}`} />
          </Button>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse">
            {isPlaying ? 'Playing' : 'Paused'}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
        <DropdownMenu song={song} />
      </div>
    </motion.div>
  );
};


const DropdownMenu = ({ song }) => {
  const { playlist, setPlaylist } = useAudio(); 

  const addToQueue = (e) => {
    e.stopPropagation();
    
  };
  
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary -mr-2" onClick={(e) => e.stopPropagation()}>
        <MoreHorizontal size={20} />
      </Button>
    </div>
  );
};

export default SongCard;
