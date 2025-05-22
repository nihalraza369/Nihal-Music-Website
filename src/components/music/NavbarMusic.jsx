
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Music, User, Disc, Mic2, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NavbarMusic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Discover', href: '/', icon: <Music size={18} /> },
    { name: 'Genres', href: '/genre/all', icon: <Disc size={18} /> },
    { name: 'Artists', href: '/artist/all', icon: <Mic2 size={18} /> },
    { name: 'Radio', href: '/radio', icon: <Radio size={18} /> },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMenu();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled || isOpen ? 'bg-background/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container-music">
        <nav className="flex items-center justify-between py-3 md:py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-3xl font-extrabold flex items-center">
              <Music size={32} className="mr-2 text-primary" />
              <span className="gradient-text-purple">Nihal Music</span>
            </Link>
          </motion.div>

          <motion.div 
            className="hidden lg:flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu}
                className={`nav-link-music ${location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href)) ? 'active text-primary' : ''}`}
              >
                {link.icon && <span className="mr-1.5">{link.icon}</span>}
                {link.name}
              </Link>
            ))}
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2 md:space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Input 
                type="search" 
                placeholder="Search songs, artists..." 
                className="search-input-music !py-2 !pr-10 w-48 lg:w-64 focus:w-56 lg:focus:w-72 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary">
                <Search size={18} />
              </Button>
            </form>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground hover:text-primary" aria-label="User Profile">
              <User size={20} />
            </Button>
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu" className="text-muted-foreground hover:text-primary">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </motion.div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 lg:hidden pt-[70px] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container-music flex flex-col space-y-2 p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Input 
                    type="search" 
                    placeholder="Search anything..." 
                    className="search-input-music w-full !py-3 !pr-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary">
                    <Search size={20} />
                  </Button>
                </div>
              </form>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center text-lg py-3.5 px-4 rounded-lg transition-colors ${location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href)) ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-white/5'}`}
                    onClick={closeMenu}
                  >
                    {link.icon && <span className="mr-3">{link.icon}</span>}
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                className="pt-6 border-t border-border/50"
              >
                 <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 py-3 text-base">
                    <User size={18} className="mr-2" /> Login / Sign Up
                 </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarMusic;
