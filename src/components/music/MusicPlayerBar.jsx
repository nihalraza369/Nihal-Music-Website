
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, ListMusic, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { Link } from 'react-router-dom';

const MusicPlayerBar = () => {
  const {
    currentSong, isPlaying, progress, duration, volume, isMuted,
    togglePlayPause, seek, changeVolume, toggleMute, playNext, playPrev,
    isShuffle, toggleShuffle, repeatMode, cycleRepeatMode, playlist, currentIndex, playSong
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) {
    return null; 
  }

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border shadow-2xl"
        >
          <div className="container-music px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 min-w-0 w-1/3">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img  
                    src={currentSong.coverArt ? `/images/${currentSong.coverArt}` : `https://picsum.photos/seed/${currentSong.id}/100/100`} 
                    alt={currentSong.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{currentSong.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-1.5 w-1/3">
                <div className="flex items-center gap-3 md:gap-4">
                  <Button variant="ghost" size="icon" onClick={toggleShuffle} className={`control-button-music ${isShuffle ? 'text-primary' : ''}`} aria-label="Shuffle">
                    <Shuffle size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playPrev} className="control-button-music" aria-label="Previous Song" disabled={currentIndex === 0 && repeatMode !== 'all'}>
                    <SkipBack size={20} />
                  </Button>
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={togglePlayPause} 
                    className="w-10 h-10 rounded-full gradient-bg-purple text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={22} fill="currentColor"/> : <Play size={22} fill="currentColor"/>}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNext} className="control-button-music" aria-label="Next Song" disabled={currentIndex === playlist.length - 1 && repeatMode !== 'all'}>
                    <SkipForward size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={cycleRepeatMode} className={`control-button-music ${repeatMode !== 'none' ? 'text-primary' : ''}`} aria-label="Repeat">
                    <Repeat size={18} className={repeatMode === 'one' ? 'opacity-100' : repeatMode === 'all' ? 'opacity-70' : 'opacity-50'}/>
                    {repeatMode === 'one' && <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[0.5px]">1</span>}
                  </Button>
                </div>
                <div className="w-full max-w-xs md:max-w-sm flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(progress)}</span>
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    onValueChange={(value) => seek(value[0])}
                    className="w-full [&>span:first-child]:h-1.5 [&>span:first-child>span]:h-1.5"
                    aria-label="Song progress"
                  />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Volume & Queue */}
              <div className="flex items-center justify-end gap-2 w-1/3">
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="control-button-music md:hidden" aria-label="Toggle Playlist">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleMute} className="control-button-music" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => changeVolume(value[0] / 100)}
                  className="w-20 hidden md:flex [&>span:first-child]:h-1.5 [&>span:first-child>span]:h-1.5"
                  aria-label="Volume control"
                />
                 <Button variant="ghost" size="icon" className="control-button-music hidden md:inline-flex" aria-label="View Queue">
                  <ListMusic size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Expanded View for Mobile - Playlist (Placeholder) */}
          <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-card/50 border-t border-border overflow-y-auto max-h-60"
            >
              <div className="p-4">
                <h4 className="font-semibold mb-2 text-sm">Up Next</h4>
                {playlist.slice(currentIndex + 1, currentIndex + 6).map((song) => (
                  <button key={song.id} onClick={() => { playSong(song, playlist); setIsExpanded(false); }} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 text-left">
                    <img  src={song.coverArt ? `/images/${song.coverArt}` : `https://picsum.photos/seed/${song.id}/40/40`} alt={song.title} className="w-8 h-8 rounded"/>
                    <div>
                      <p className="text-xs font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </button>
                ))}
                {playlist.length === 0 && <p className="text-xs text-muted-foreground">Queue is empty.</p>}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayerBar;
