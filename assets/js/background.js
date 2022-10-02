let mode = false,
    countRequest = 0

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({mode})
    chrome.storage.sync.set({countRequest})
    console.group('Background: onInstalled action')
    console.log(`Default mode set to %c${mode}`, `color: green`)
    console.groupEnd()
});
