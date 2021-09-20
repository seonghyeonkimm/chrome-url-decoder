(() => {
  const decodeTextContentsInPage = () => { 
    // TODO: (chrome storage) option페이지에서 세팅할 수 있도록
    const SELECTORS_TO_DECODE = [
      ...document.querySelectorAll('[data-test-id="loaded-device-name"]'),
      ...document.querySelectorAll('[data-test-id="http-renderer-external-link"]'),
      ...document.querySelectorAll('span.val-string'),
      ...document.querySelectorAll('em'),
    ];
  
    SELECTORS_TO_DECODE.forEach(item => {
      item.textContent = decodeURIComponent(item.textContent);
    });
  }
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(() => {
      const isLoaded = document.body.querySelectorAll('[data-test-id="group"').length > 0;
      if (!isLoaded) {
        return;
      }

      decodeTextContentsInPage();
      observer.disconnect();
    });
  });
  
  observer.observe(
    document.body, 
    { childList: true },
  )
})()