const sizes = JSON.stringify([
  { width: 3840, height: 2160, name: '2160p' },
  { width: 1920, height: 1080, name: '1080p' },
  { width: 1280, height: 720, name: '720p' },
]);
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install') {
    //Install event
    chrome.storage.sync.set({ sizes });
  } // else if (details.reason == 'update') //Update event
});
