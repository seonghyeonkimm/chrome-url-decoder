(() => {
  chrome.storage.sync.get('rules', function(result) {
    const rules = result.rules || [];
    const originData = rules.find((rule) => rule.origin === window.location.origin);
    if (!originData) {
      return;
    }

    const { decodeSelectors, loadedSelectors } = originData;
    const decodeTextContentsInPage = () => { 
      const selected = decodeSelectors.split(',').reduce((current, next) =>
        current.concat(...document.querySelectorAll(next.trim())), [],
      )
    
      selected.forEach(item => {
        try {
          item.textContent = decodeURIComponent(item.textContent);
        } catch {};
      });
    }

    const observer = new MutationObserver(function(mutations) {
      function runJob() {
        decodeTextContentsInPage();
        observer.disconnect();
      }

      mutations.forEach(() => {
        if (!loadedSelectors) {
          runJob();
          return;
        }

        const loaded = loadedSelectors.split(',').reduce((current, next) =>
          current.concat(...document.querySelectorAll(next.trim())), [],
        )
        const isLoaded = loaded.length > 0;
        if (!isLoaded) {
          return;
        }

        runJob();
      });
    });

    decodeTextContentsInPage();
    observer.observe(
      document.body, 
      {
        subtree: true,
        childList: true,
        attributes: true,
      },
    );
  });
})()