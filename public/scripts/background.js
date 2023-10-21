
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let currentWindow = null;
chrome.windows.onRemoved.addListener(
  (windowId) => {
    if (currentWindow?.id === windowId) {
      currentWindow = null;
    }
  }
)
chrome.runtime.onMessage.addListener(async request => {
  if (request.type === "OpenAuth") {
    if (currentWindow) {
      await chrome.windows.remove(currentWindow.id);
    }
    const data = request.href.includes('?i_m=')
      ? { type: 'base64', payload: request.href.split('?i_m=')[1] }
      : { type: 'link', payload: decodeURIComponent(request.href.split('?request_uri=')[1]) };

    chrome.windows.create({
      url: chrome.runtime.getURL(`index.html#/auth?type=${data.type}&payload=${data.payload}`),
      type: "popup",
      focused: true,
      width: 390,
      height: 600,
      top: 0,
      left: request.windowWidth - 390,
    }, (window) => {
      currentWindow = window;
    });
  }
});

console.log('loading');
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.runtime.sendMessage({ action: 'backgroundToPopup', data: request }, function(response) {
      if (response) {
        // Handle the response from the background script
        console.log('Response from background:', response);
      }
    });
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'popupToBackground') {
    // Process the message from the popup
    const dataFromPopup = request.data;
    console.log('Message from popup:', dataFromPopup);

    // Perform some action in the background
    // You can also send a response back to the popup if needed
    const response = 'Background has processed the message';
    sendResponse(response);
  }
});
