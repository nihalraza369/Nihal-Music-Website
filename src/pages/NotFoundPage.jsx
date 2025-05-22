
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Music } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center section-padding bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="max-w-md p-8 glass-card animated-border-glow"
      >
        <Music size={60} className="mx-auto text-primary mb-6 animate-pulse-glow" />
        <h1 className="text-6xl md:text-7xl font-black gradient-text-purple mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Lost in Sound?</h2>
        <p className="text-lg text-muted-foreground mb-10">
          It seems this page is offbeat. Let's get you back to the main stage.
        </p>
        <Button size="lg" asChild className="gradient-bg-purple text-primary-foreground shadow-lg hover:shadow-primary/40">
          <Link to="/">Back to Nihal Music Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
