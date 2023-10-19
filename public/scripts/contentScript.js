'use strict';
document.addEventListener('authEvent', function(e) {
    chrome.runtime.sendMessage({type: 'OpenAuth', href: e.detail, windowWidth: window.screen.width})
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "GetPromotions") {
    //FIXME: Fetch actual promotions from the SC plugin backend
    const promotions = [{ name: "Some Fake Promotion" }];
    //FIXME: This is to mimic an asynchronious call
    setTimeout(() => sendResponse({ promotions }), 100);
    // This is needed in order to allow for asynchronous call of `sendResponse` callback
    return true;
  }
});
