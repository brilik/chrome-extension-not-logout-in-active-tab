let mode = false,
    timeOut,
    counterRequests = 0

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({text: 'off'})
    chrome.storage.sync.set({mode})
    chrome.storage.sync.set({counterRequests})
    console.group('Background: onInstalled action')
    console.log(`Default mode set to %c${mode}`, `color: green`)
    console.groupEnd()
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let count = 0

        if (request.mode) {
            timeOut = setInterval(() => {
                count++
                fetch(request.locationHref, {method: "GET"})
                    .then((data) => {
                        chrome.storage.sync.set({counterRequests: count})
                        console.warn(data, count)
                    })
            }, request.intervalTime)
        } else {
            clearInterval(timeOut)
        }

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        sendResponse(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
    }
);
