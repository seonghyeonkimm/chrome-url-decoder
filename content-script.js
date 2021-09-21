(() => {
  chrome.storage.sync.get('rules', function(result) {
    const rules = result.rules || [];
    const patternData = rules.find((rule) => rule.urlPattern === window.location.origin);
    if (!patternData) {
      return;
    }

    const { decodeSelectors, loadingSelector } = patternData;
    const decodeTextContentsInPage = () => { 
      const selected = decodeSelectors.split(',').reduce((current, next) =>
        current.concat(...document.querySelectorAll(next.trim())), [],
      )
    
      selected.forEach(item => {
        item.textContent = decodeURIComponent(item.textContent);
      });
    }

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(() => {
        const isLoaded = document.body.querySelectorAll(loadingSelector).length > 0;
        if (!isLoaded) {
          return;
        }

        decodeTextContentsInPage();
        observer.disconnect();
      });
    });

    decodeTextContentsInPage();
    observer.observe(
      document.body, 
      { childList: true },
    );
  });
})()