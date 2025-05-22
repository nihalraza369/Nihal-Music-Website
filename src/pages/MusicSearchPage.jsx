
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongCard from '@/components/music/SongCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, XCircle, ListMusic, User, Disc } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const MusicSearchPage = () => {
  const { query: initialQuery } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { songsData } = useAudio(); // Removed playSong as it's handled by SongCard

  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('songs');

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      setResults({ songs: [], artists: [], albums: [] });
    }
  }, [initialQuery, songsData]);

  const performSearch = (query) => {
    if (!query || query.trim() === '') {
      setResults({ songs: [], artists: [], albums: [] });
      return;
    }
    setIsLoading(true);
    const lowerQuery = query.toLowerCase();
    
    const filteredSongs = songsData.filter(song => 
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album.toLowerCase().includes(lowerQuery)
    );

    const uniqueArtists = [...new Map(songsData
      .filter(song => song.artist.toLowerCase().includes(lowerQuery))
      .map(song => [song.artist, {
        id: song.artist.toLowerCase().replace(/\s+/g, '-'),
        name: song.artist,
        coverArt: song.coverArt,
      }])).values()];

    const uniqueAlbums = [...new Map(songsData
      .filter(song => song.album.toLowerCase().includes(lowerQuery))
      .map(song => [song.album, {
        id: song.album.toLowerCase().replace(/\s+/g, '-'),
        title: song.album,
        artist: song.artist,
        coverArt: song.coverArt,
      }])).values()];

    setTimeout(() => {
      setResults({ songs: filteredSongs, artists: uniqueArtists, albums: uniqueAlbums });
      setIsLoading(false);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = inputQuery.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
      navigate(`/search/${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/search');
      setSearchQuery('');
      setResults({ songs: [], artists: [], albums: [] });
    }
  };
  
  const clearSearch = () => {
    setInputQuery('');
    setSearchQuery('');
    setResults({ songs: [], artists: [], albums: [] });
    navigate('/search');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.07 } }
  };
  
  const tabs = [
    { name: 'Songs', key: 'songs', count: results.songs.length, icon: <ListMusic size={18}/> },
    { name: 'Artists', key: 'artists', count: results.artists.length, icon: <User size={18}/> },
    { name: 'Albums', key: 'albums', count: results.albums.length, icon: <Disc size={18}/> },
  ];

  return (
    <motion.div 
      className="section-padding pt-24 md:pt-28 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container-music">
        <motion.form 
          onSubmit={handleSearchSubmit} 
          className="mb-10 md:mb-12 relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Input 
            type="search" 
            placeholder="Search for songs, artists, albums..." 
            className="search-input-music w-full !text-lg !py-4 !pl-12 !pr-20"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />
          <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          {inputQuery && (
            <Button type="button" variant="ghost" size="icon" onClick={clearSearch} className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              <XCircle size={20} />
            </Button>
          )}
           <Button type="submit" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 text-primary px-3">Go</Button>
        </motion.form>

        {searchQuery && (
          <div className="mb-8">
            <div className="flex border-b border-border">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                    ${activeTab === tab.key 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab.icon} {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="song-card animate-pulse">
                <div className="relative aspect-square rounded-lg bg-muted/30 mb-4"></div>
                <div><div className="h-5 w-3/4 bg-muted/30 rounded mb-1.5"></div><div className="h-4 w-1/2 bg-muted/30 rounded"></div></div>
              </div>
            ))}
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Find Your Sound</h2>
            <p className="text-muted-foreground">Start typing above to search for music.</p>
          </div>
        ) : (
          <>
            {activeTab === 'songs' && (
              results.songs.length > 0 ? (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" variants={listVariants} initial="hidden" animate="visible">
                  {results.songs.map((song, index) => <SongCard key={song.id} song={song} index={index} playlist={results.songs} />)}
                </motion.div>
              ) : <p className="text-muted-foreground text-center py-8">No songs found for "{searchQuery}".</p>
            )}
            {activeTab === 'artists' && (
               results.artists.length > 0 ? (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" variants={listVariants} initial="hidden" animate="visible">
                  {results.artists.map((artist) => (
                    <motion.div key={artist.id} variants={{hidden: {opacity:0, y:15}, visible:{opacity:1,y:0}}}>
                      <Link to={`/artist/${artist.id}`} className="block song-card text-center p-5 group">
                        <img  src={artist.coverArt ? `/images/${artist.coverArt}` : `https://picsum.photos/seed/${artist.id}/200/200`} alt={artist.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-transparent group-hover:border-primary/50 transition-all duration-300"/>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">{artist.name}</h3>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : <p className="text-muted-foreground text-center py-8">No artists found for "{searchQuery}".</p>
            )}
            {activeTab === 'albums' && (
              results.albums.length > 0 ? (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" variants={listVariants} initial="hidden" animate="visible">
                  {results.albums.map((album) => (
                     <motion.div key={album.id} variants={{hidden: {opacity:0, y:15}, visible:{opacity:1,y:0}}}>
                      <Link to={`/album/${album.id}`} className="block song-card p-4 group">
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                          <img  src={album.coverArt ? `/images/${album.coverArt}` : `https://picsum.photos/seed/${album.id}/300/300`} alt={album.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                        </div>
                        <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors truncate">{album.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : <p className="text-muted-foreground text-center py-8">No albums found for "{searchQuery}".</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MusicSearchPage;
