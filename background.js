chrome.runtime.onInstalled.addListener(() => {
  console.log('Url Decoder worker is installed');
});


chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('🚀 ~ tab', tab);
  console.log('clicked icon');
});
