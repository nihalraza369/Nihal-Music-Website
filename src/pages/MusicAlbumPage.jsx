
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongCard from '@/components/music/SongCard'; // Assuming SongCard can be adapted or a similar AlbumSongItem is made
import { Button } from '@/components/ui/button';
import { ArrowLeft, Disc, PlayCircle, Clock } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const MusicAlbumPage = () => {
  const { albumId } = useParams();
  const { songsData, playSong } = useAudio();
  const [albumInfo, setAlbumInfo] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const foundAlbumSongs = songsData.filter(song => song.album.toLowerCase().replace(/\s+/g, '-') === albumId);

    if (foundAlbumSongs.length > 0) {
      const firstSong = foundAlbumSongs[0];
      setAlbumInfo({
        id: albumId,
        title: firstSong.album,
        artist: firstSong.artist,
        artistId: firstSong.artist.toLowerCase().replace(/\s+/g, '-'),
        coverArt: firstSong.coverArt || `https://picsum.photos/seed/${albumId}/400/400`,
        year: firstSong.year,
        genre: firstSong.genre,
        totalDuration: foundAlbumSongs.reduce((sum, s) => sum + s.duration, 0),
      });
      setAlbumSongs(foundAlbumSongs);
    } else {
      setAlbumInfo(null);
      setAlbumSongs([]);
    }
    
    setTimeout(() => setIsLoading(false), 300);

  }, [albumId, songsData]);

  const formatTotalDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} min`;
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" } })
  };

  if (isLoading) {
     return (
      <div className="section-padding pt-24 md:pt-28 min-h-screen container-music text-center">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 p-6 md:p-8 glass-card">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg bg-muted/30 flex-shrink-0"></div>
            <div className="text-center md:text-left flex-grow">
              <div className="h-10 w-3/4 bg-muted/30 rounded mb-3"></div>
              <div className="h-6 w-1/2 bg-muted/30 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-muted/30 rounded mb-5"></div>
              <div className="flex gap-3 justify-center md:justify-start">
                <div className="h-12 w-32 bg-muted/30 rounded-lg"></div>
                <div className="h-12 w-28 bg-muted/30 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted/30 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }
  
  if (!albumInfo) {
    return (
      <div className="section-padding pt-24 md:pt-28 min-h-screen container-music text-center">
        <Disc size={64} className="mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Album Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find an album with that ID.</p>
        <Button asChild className="gradient-bg-purple text-primary-foreground">
          <Link to="/">Explore Music</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="section-padding pt-24 md:pt-28 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container-music">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Link to={`/artist/${albumInfo.artistId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2"/> Back to {albumInfo.artist}
          </Link>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 p-6 md:p-8 glass-card animated-border-glow"
          variants={itemVariants} custom={0}
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 border-4 border-primary/30">
            <img  
              src={albumInfo.coverArt ? `/images/${albumInfo.coverArt}` : `https://picsum.photos/seed/${albumInfo.id}/400/400`} 
              alt={`Cover art for ${albumInfo.title}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-1">Album</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight gradient-text-purple mb-1">{albumInfo.title}</h1>
            <Link to={`/artist/${albumInfo.artistId}`} className="text-xl md:text-2xl font-semibold text-foreground hover:text-primary transition-colors mb-1 inline-block">{albumInfo.artist}</Link>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              {albumInfo.genre} &bull; {albumInfo.year} &bull; {albumSongs.length} songs &bull; <Clock size={14} className="inline mr-1 mb-0.5"/>{formatTotalDuration(albumInfo.totalDuration)}
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Button size="lg" className="gradient-bg-purple text-primary-foreground" onClick={() => playSong(albumSongs[0], albumSongs)}>
                <PlayCircle size={20} className="mr-2"/> Play Album
              </Button>
            </div>
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-8">Tracks</h2>
        <div className="space-y-3">
          {albumSongs.map((song, index) => (
            <motion.div 
              key={song.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-card/70 transition-colors duration-200 cursor-pointer song-list-item group"
              variants={itemVariants}
              custom={index + 1}
              onClick={() => playSong(song, albumSongs)}
            >
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-6 text-right">{index + 1}.</span>
                <img  
                  src={song.coverArt ? `/images/${song.coverArt}` : `https://picsum.photos/seed/${song.id}/50/50`} 
                  alt={song.title} 
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">{formatTotalDuration(song.duration)}</span>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={22} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MusicAlbumPage;
