// onInstalled

// tab url이 업데이트되었을 때에 content-script 실행
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js']
    });
  }
});

// icon을 클릭했을 때에 content-script를 실행
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get('rules', function(result) {
    const rules = result.rules || [];
    const origins = rules.map((item) => {
      return item && item.origin ? item.origin : undefined;
    }).filter(Boolean);

    if (origins.length === 0) {
      return;
    }

    const { origin } = new URL(tab.url);
    if (!origins.includes(origin)) {
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script.js']
    });
  });
});