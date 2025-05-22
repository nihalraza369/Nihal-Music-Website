
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const genres = [
  { name: 'Electronic', slug: 'electronic', color: 'from-sky-500 to-cyan-500', imgKey: 'genre-electronic' },
  { name: 'Rock', slug: 'rock', color: 'from-red-500 to-rose-500', imgKey: 'genre-rock' },
  { name: 'Hip Hop', slug: 'hip-hop', color: 'from-amber-500 to-yellow-500', imgKey: 'genre-hiphop' },
  { name: 'Pop', slug: 'pop', color: 'from-pink-500 to-fuchsia-500', imgKey: 'genre-pop' },
  { name: 'Jazz', slug: 'jazz', color: 'from-indigo-500 to-purple-500', imgKey: 'genre-jazz' },
  { name: 'Classical', slug: 'classical', color: 'from-gray-500 to-slate-500', imgKey: 'genre-classical' },
  { name: 'Lo-Fi', slug: 'lo-fi', color: 'from-teal-500 to-emerald-500', imgKey: 'genre-lofi' },
  { name: 'Synthwave', slug: 'synthwave', color: 'from-violet-600 to-fuchsia-700', imgKey: 'genre-synthwave' },
];

const GenreCarousel = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="section-padding">
      <div className="container-music">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Explore <span className="gradient-text-purple">Genres</span></h2>
          <Link to="/genre/all" className="text-sm font-medium text-primary hover:underline flex items-center">
            View All <ChevronRight size={18} className="ml-1" />
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {genres.slice(0, 8).map((genre) => (
            <motion.div key={genre.slug} variants={cardVariants}>
              <Link 
                to={`/genre/${genre.slug}`} 
                className={`block rounded-xl p-5 md:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br ${genre.color} group relative overflow-hidden animated-border-glow`}
              >
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{genre.name}</h3>
                  <p className="text-xs text-white/80">Tap to explore</p>
                </div>
                <img  
                  alt={`${genre.name} genre visual representation`} 
                  className="absolute -right-4 -bottom-4 w-20 h-20 md:w-24 md:h-24 opacity-30 group-hover:opacity-50 transition-opacity duration-300 transform group-hover:rotate-6"
                  src={`https://picsum.photos/seed/${genre.imgKey}/100/100`} 
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GenreCarousel;
