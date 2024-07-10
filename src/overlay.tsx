// src/Overlay.tsx
import React, { useState, useEffect } from 'react';
import './Overlay.css';

const Overlay: React.FC = () => {
  const [cursorX, setCursorX] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      console.log('Mouse moved to:', event.clientX);
      setCursorX(event.clientX);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    chrome.storage.sync.get('isOverlayEnabled', (data) => {
      console.log('Initial overlay state:', data.isOverlayEnabled);
      const overlayElement = document.querySelector('.overlay') as HTMLElement;
      if (overlayElement) {
        overlayElement.style.display = data.isOverlayEnabled ? 'block' : 'none';
      }
    });
  }, []);

  return (
    <div className="overlay">
      <div className="highlight-column" style={{ left: cursorX - 50 }} />
    </div>
  );
};

export default Overlay;
