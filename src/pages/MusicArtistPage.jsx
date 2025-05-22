
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongCard from '@/components/music/SongCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, PlayCircle, Plus } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const MusicArtistPage = () => {
  const { artistId } = useParams();
  const { songsData, playSong } = useAudio();
  const [artistInfo, setArtistInfo] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageTitle = artistId === 'all' ? 'All Artists' : artistInfo?.name || 'Artist';

  useEffect(() => {
    setIsLoading(true);
    let foundArtist = null;
    let filteredSongs = [];

    if (artistId === 'all') {
      const allArtists = [...new Set(songsData.map(song => song.artist))].map(artistName => {
        const artistSampleSong = songsData.find(s => s.artist === artistName);
        return {
          id: artistName.toLowerCase().replace(/\s+/g, '-'),
          name: artistName,
          bio: `Discover the unique sound of ${artistName}.`,
          coverArt: artistSampleSong?.coverArt || `https://picsum.photos/seed/${artistName}/400/400`,
          genre: artistSampleSong?.genre || 'Various',
        };
      });
      setArtistInfo({ name: 'All Artists', isAllArtistsPage: true, artistsList: allArtists });
      setArtistSongs([]); // No specific songs for "all artists" view, show artist cards instead
    } else {
      foundArtist = songsData.find(song => song.artist.toLowerCase().replace(/\s+/g, '-') === artistId);
      if (foundArtist) {
        const artistDetails = {
          id: artistId,
          name: foundArtist.artist,
          bio: `Explore the discography of ${foundArtist.artist}, known for their captivating ${foundArtist.genre} tracks.`,
          coverArt: foundArtist.coverArt || `https://picsum.photos/seed/${artistId}/400/400`,
          genre: foundArtist.genre,
          isAllArtistsPage: false,
        };
        setArtistInfo(artistDetails);
        filteredSongs = songsData.filter(song => song.artist.toLowerCase().replace(/\s+/g, '-') === artistId);
        setArtistSongs(filteredSongs);
      } else {
        setArtistInfo(null); 
        setArtistSongs([]);
      }
    }
    
    setTimeout(() => setIsLoading(false), 300);

  }, [artistId, songsData]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (isLoading) {
    return (
      <div className="section-padding pt-24 md:pt-28 min-h-screen container-music text-center">
        <div className="animate-pulse">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-muted/30 mx-auto mb-8"></div>
          <div className="h-10 w-1/2 bg-muted/30 mx-auto rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-muted/30 mx-auto rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-muted/30 mx-auto rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-muted/30 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }
  
  if (!artistInfo && artistId !== 'all') {
    return (
      <div className="section-padding pt-24 md:pt-28 min-h-screen container-music text-center">
        <User size={64} className="mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find an artist with that ID.</p>
        <Button asChild className="gradient-bg-purple text-primary-foreground">
          <Link to="/artist/all">Explore All Artists</Link>
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
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2"/> Back to Discover
          </Link>
        </motion.div>

        {!artistInfo.isAllArtistsPage && (
          <motion.div 
            className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 p-6 md:p-8 glass-card animated-border-glow"
            variants={itemVariants}
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl flex-shrink-0 border-4 border-primary/30">
              <img  
                src={artistInfo.coverArt ? `/images/${artistInfo.coverArt}` : `https://picsum.photos/seed/${artistInfo.id}/400/400`} 
                alt={`Portrait of ${artistInfo.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-1">{artistInfo.genre}</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight gradient-text-purple mb-2">{artistInfo.name}</h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base mb-5">{artistInfo.bio}</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Button size="lg" className="gradient-bg-purple text-primary-foreground" onClick={() => playSong(artistSongs[0], artistSongs)}>
                  <PlayCircle size={20} className="mr-2"/> Play All
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 text-primary/90 hover:bg-primary/10">
                  <Plus size={20} className="mr-2"/> Follow
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {artistInfo.isAllArtistsPage ? (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 text-center">
              All <span className="gradient-text-purple">Artists</span>
            </h1>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.05 }}}}
              initial="hidden"
              animate="visible"
            >
              {artistInfo.artistsList.map((artist, index) => (
                <motion.div key={artist.id} variants={itemVariants}>
                  <Link to={`/artist/${artist.id}`} className="block song-card text-center p-5 group">
                    <img  
                      src={artist.coverArt ? `/images/${artist.coverArt}` : `https://picsum.photos/seed/${artist.id}/200/200`} 
                      alt={artist.name} 
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-transparent group-hover:border-primary/50 transition-all duration-300"
                    />
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">{artist.name}</h3>
                    <p className="text-xs text-muted-foreground">{artist.genre}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8">Top Tracks by <span className="text-primary">{artistInfo.name}</span></h2>
            {artistSongs.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={{ visible: { transition: { staggerChildren: 0.07 }}}}
                initial="hidden"
                animate="visible"
              >
                {artistSongs.map((song, index) => (
                  <SongCard key={song.id} song={song} index={index} playlist={artistSongs} />
                ))}
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-lg">No tracks found for this artist yet.</p>
            )}
          </>
        )}

      </div>
    </motion.div>
  );
};

export default MusicArtistPage;
