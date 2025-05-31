import React, { useState, useEffect } from 'react';
import { Box, LinearProgress } from '@mui/material';

const ReadProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      setProgress(scrollPercentRounded);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.2s linear',
          },
        }}
      />
    </Box>
  );
};

export default ReadProgress; 