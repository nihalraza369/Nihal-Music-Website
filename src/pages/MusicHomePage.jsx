
import React from 'react';
import { motion } from 'framer-motion';
import HeroMusic from '@/components/music/HeroMusic';
import SongCard from '@/components/music/SongCard';
import GenreCarousel from '@/components/music/GenreCarousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Radio } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const MusicHomePage = () => {
  const { songsData, playSong } = useAudio();
  const featuredSongs = songsData.slice(0, 8); 
  const newReleases = songsData.slice(3, 7).reverse(); 

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="overflow-x-hidden">
      <HeroMusic />
      <GenreCarousel />

      <motion.section 
        className="section-padding"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-music">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Featured <span className="gradient-text-purple">Tracks</span></h2>
            <Button variant="link" asChild className="text-primary hover:underline">
              <Link to="/tracks/featured">View All <ArrowRight size={18} className="ml-1" /></Link>
            </Button>
          </div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={listVariants}
          >
            {featuredSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} playlist={featuredSongs} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="section-padding bg-card/30"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-music">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">New <span className="gradient-text-purple">Releases</span></h2>
            <Button variant="link" asChild className="text-primary hover:underline">
              <Link to="/albums/new">Explore More <ArrowRight size={18} className="ml-1" /></Link>
            </Button>
          </div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={listVariants}
          >
            {newReleases.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} playlist={newReleases} />
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section
        className="section-padding"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-music">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <TrendingUp size={40} className="text-primary" />, title: "Trending Now", desc: "Discover what's hot and topping the charts." , link: "/charts"},
              { icon: <Users size={40} className="text-primary" />, title: "Top Artists", desc: "Explore music from world-renowned and upcoming artists.", link: "/artist/all" },
              { icon: <Radio size={40} className="text-primary" />, title: "Live Radio", desc: "Tune into diverse radio stations for non-stop music.", link: "/radio" }
            ].map((item, index) => (
              <motion.div 
                key={item.title} 
                className="glass-card p-8 hover:shadow-primary/20 transition-shadow duration-300"
                initial={{ opacity:0, scale:0.9 }}
                whileInView={{ opacity:1, scale:1 }}
                transition={{ duration:0.5, delay: index * 0.1}}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.desc}</p>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                  <Link to={item.link}>Explore</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default MusicHomePage;
