
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Headphones, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroMusic = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
  };
  
  return (
    <div className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden section-padding bg-aurora-gradient bg-[size:400%_400%] animate-aurora">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-purple-900/30 via-transparent to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-pink-900/30 via-transparent to-transparent opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      <div className="container-music text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-8"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-5 py-2.5 bg-card/70 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-primary shadow-lg"
          >
            <Headphones size={18} className="mr-2.5" />
            Immerse Yourself in Sound
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
          >
            Discover Your Next <br className="hidden md:block" /> <span className="gradient-text-purple">Favorite Song</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore millions of tracks, curated playlists, and personalized recommendations. The ultimate music experience awaits.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="gradient-bg-purple text-primary-foreground shadow-xl w-full sm:w-auto !text-base !px-8 !py-6 animated-border-glow" asChild>
              <Link to="/genre/all">
                <PlayCircle size={22} className="mr-2.5" /> Start Listening
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary/70 text-primary hover:bg-primary/10 hover:text-primary !text-base !px-8 !py-6" asChild>
              <Link to="/search">
                <Search size={20} className="mr-2.5" /> Find Music
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroMusic;
