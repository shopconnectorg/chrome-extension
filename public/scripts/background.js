
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

function sendMessageToContentScript(tabId, message) {
  chrome.tabs.sendMessage(tabId, message);
}

chrome.runtime.onMessage.addListener(async request => {
  if (request.action === 'contentToBackground') {
    console.log(request);
    // Forward message to React app
    chrome.runtime.sendMessage({ action: 'backgroundToApp', payload: request.payload }, function(response) {
      if (response) {
        // Handle the response from the background script
        console.log('Response from background:', response);
      }
    });
  }

  if (request.action === 'appToBackground') {
    // Identify the tab you want to communicate with
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        const message = { action: 'backgroundToContent', data: 'Hello from the background' };
        sendMessageToContentScript(tabId, { action: 'backgroundToContent', payload: request.payload });
      }
    });
  }
});
