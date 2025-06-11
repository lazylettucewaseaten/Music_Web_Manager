chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: disableBeforeUnloadPrompt
    });
  }
});

function disableBeforeUnloadPrompt() {
  // 1. Prevent assignment to window.onbeforeunload
  Object.defineProperty(window, 'onbeforeunload', {
    configurable: true,
    get: function () {
      return null;
    },
    set: function () {
      // Block it silently
    }
  });

  // 2. Prevent event listener attachment
  const origAddEventListener = window.addEventListener;
  window.addEventListener = function (type, listener, options) {
    if (type === 'beforeunload') {
      console.warn('Blocked beforeunload listener');
      return;
    }
    return origAddEventListener.call(this, type, listener, options);
  };

  // 3. Remove all existing beforeunload handlers via event listener inspection
  window.removeEventListener('beforeunload', () => {}, true);

  // 4. Overwrite EventTarget prototype to prevent dynamic frame access
  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'beforeunload') {
      console.warn('Blocked dynamic beforeunload listener');
      return;
    }
    return origAdd.call(this, type, listener, options);
  };

  // 5. Remove periodic re-injection attempts from page
  setInterval(() => {
    window.onbeforeunload = null;
  }, 500);
}
