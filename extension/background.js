// extension이 install되었을 때에 기본 option값 추가
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('rules', function(result) {
    const rules = result.rules;
    if (rules) {
      return;
    }

    chrome.storage.sync.set({
      rules: [{
        origin: 'https://sentry.io',
        decodeSelectors: 'em, [data-test-id="loaded-device-name"], [data-test-id="http-renderer-external-link"]',
        loadedSelectors: '[data-test-id="group"], [data-test-id="event-entries-loading-false"]',
      }],
    });
  });
});

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