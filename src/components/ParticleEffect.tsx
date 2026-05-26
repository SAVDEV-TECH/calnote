'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  x: number;
  y: number;
  text: string;
  color: string;
}

const Particle: React.FC<ParticleProps> = ({ x, y, text, color }) => {
  const randomOffsetX = (Math.random() - 0.5) * 100;
  
  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{
        x: x + randomOffsetX,
        y: y - 100,
        opacity: 0,
        scale: 0.5
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed pointer-events-none font-bold text-lg"
      style={{ color }}
    >
      {text}
    </motion.div>
  );
};

export default Particle;
