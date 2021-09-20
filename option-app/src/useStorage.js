import React from 'react';

function useStorage(key) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof chrome.storage === 'undefined') {
      return;
    }

    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(key, function(result) {
      setData(result[key]);
      setLoading(false);
    });
  }, [key]);

  return {
    data,
    loading,
  }
}

export default useStorage;