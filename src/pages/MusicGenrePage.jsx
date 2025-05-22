
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongCard from '@/components/music/SongCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, ListMusic } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const MusicGenrePage = () => {
  const { genreName } = useParams();
  const { songsData, playSong } = useAudio();
  const [genreSongs, setGenreSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageTitle = genreName === 'all' ? 'All Genres' : genreName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    setIsLoading(true);
    let filteredSongs;
    if (genreName === 'all') {
      filteredSongs = songsData;
    } else {
      filteredSongs = songsData.filter(song => song.genre.toLowerCase().replace(/\s+/g, '-') === genreName);
    }
    
    setTimeout(() => {
      setGenreSongs(filteredSongs);
      setIsLoading(false);
    }, 300);

  }, [genreName, songsData]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.07 } }
  };

  return (
    <motion.div 
      className="section-padding pt-24 md:pt-28 bg-gradient-to-b from-background to-background/90 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container-music">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 md:mb-12"
        >
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2"/> Back to Discover
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {pageTitle} <span className="gradient-text-purple">Vibes</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore the best tracks in {genreName === 'all' ? 'all available genres' : pageTitle.toLowerCase()}.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <span className="text-muted-foreground">{isLoading ? 'Loading...' : `${genreSongs.length} tracks found`}</span>
          <Button variant="outline" className="flex items-center gap-2 border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary">
            <Filter size={16} /> Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="song-card animate-pulse">
                <div className="relative aspect-square rounded-lg bg-muted/30 mb-4"></div>
                <div>
                  <div className="h-5 w-3/4 bg-muted/30 rounded mb-1.5"></div>
                  <div className="h-4 w-1/2 bg-muted/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : genreSongs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-16"
          >
            <ListMusic size={64} className="mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">No Tracks Found</h2>
            <p className="text-muted-foreground mb-6">
              It seems there are no tracks available for "{pageTitle}" right now.
            </p>
            <Button asChild className="gradient-bg-purple text-primary-foreground">
              <Link to="/genre/all">Explore Other Genres</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {genreSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} playlist={genreSongs} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicGenrePage;
