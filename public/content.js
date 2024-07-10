// public/content.js

console.log("Content script loaded");

// Create root div for React app
const root = document.createElement('div');
root.id = 'focus-overlay-root';
document.body.appendChild(root);

// Fetch the asset manifest and load the main script
fetch(chrome.runtime.getURL('asset-manifest.json'))
  .then((response) => response.json())
  .then((assets) => {
    const mainJs = assets['files']['main.js']; // Correctly reference the main.js
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(mainJs);
    document.body.appendChild(script);
    console.log("Injected main.js script");

    //after main.js is loaded , render overlay component  
    const overlayRoot = document.createElement('div');
    overlayRoot.className = 'overlay';
    document.body.appendChild(overlayRoot);

    const mainScript = document.createElement('script');
    mainScript.src = chrome.runtime.getURL('static/js/main.js');
    mainScript.onload = function() {
      const { Overlay } = require('./overlay');
      ReactDOM.render(
        <React.StrictMode>
          <Overlay />
        </React.StrictMode>,
        overlayRoot
      );
    };
    document.body.appendChild(mainScript);
  })
    .catch((error) => {
    console.error('Error loading main.js:', error);
  });

// Listen for messages to toggle the overlay
chrome.runtime.onMessage.addListener((message) => {
  console.log("Received message:", message);
  if (message.type === 'TOGGLE_OVERLAY') {
    const overlayElement = document.querySelector('.overlay');
    if (overlayElement) {
      overlayElement.style.display = message.isOverlayEnabled ? 'block' : 'none';
    }
  }
});
