import { useEffect } from 'react';

export const useShopConnect = () => {
  useEffect(() => {
    // Receive and process messages coming from the web page
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'backgroundToApp') {
        console.log(request.payload);
        // Process the message, for example, fetching data or performing an action
        const data = "Data from the background script";

        // Send the data back to the popup
        sendResponse({ data });
      }
    });
  }, []);

  const sendMessage = () => {
    console.log('send message');
    chrome.runtime.sendMessage({ action: 'appToBackground', payload: 'hello' });
  }

  return {
    sendMessage
  };
}
