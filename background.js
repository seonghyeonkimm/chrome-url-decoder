// TODO: onLocationChange
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get('rules', function(result) {
    const rules = result.rules || [];
    const urlPatterns = rules.map((item) => {
      return item && item.urlPattern ? item.urlPattern : undefined;
    }).filter(Boolean);

    if (urlPatterns.length === 0) {
      return;
    }

    const { origin } = new URL(tab.url);
    if (!urlPatterns.includes(origin)) {
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script.js']
    });
  });
});