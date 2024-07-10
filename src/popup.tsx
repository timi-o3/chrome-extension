// src/Popup.tsx
import React, { FC, useState, useEffect } from 'react';
import './Popup.css';
import Overlay from './overlay';

const Popup: FC = () => {
  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('isOverlayEnabled', (data) => {
      setIsOverlayEnabled(data.isOverlayEnabled);
    });
  }, []);

  const toggleOverlay = () => {
    const newState = !isOverlayEnabled;
    setIsOverlayEnabled(newState);
    chrome.storage.sync.set({ isOverlayEnabled: newState });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'TOGGLE_OVERLAY', isOverlayEnabled: newState },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError.message);
            } else {
              console.log('Response:', response);
            }
          }
        );
      }
    });
  };

  return (
    <div>
      <h1>Focus Overlay</h1>
      <button onClick={toggleOverlay}>
        {isOverlayEnabled ? 'Disable Overlay' : 'Enable Overlay'}
      </button>
      {isOverlayEnabled && <Overlay />}
      <p className="read-the-docs">
        This is a running prototype for a Chrome extension that will assist users with disabilities in reading websites.
      </p>
    </div>
  );
};

export default Popup;
