'use strict';

document.addEventListener('authEvent', function(e) {
    chrome.runtime.sendMessage({type: 'OpenAuth', href: e.detail, windowWidth: window.screen.width})
});

window.addEventListener('message', function(event) {
  if (event.data.action == 'scPluginToExtension') {
    chrome.runtime.sendMessage({ action: 'contentToBackground', payload: event.data.payload });
  }
});

chrome.runtime.onMessage.addListener(async request => {
  if (request.action === 'backgroundToContent') {
    // Forward message to React app
    window.postMessage({ action: 'extensionToSCPlugin', payload: request.payload }, '*');
  }
});
