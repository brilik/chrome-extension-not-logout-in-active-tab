let mode = false,
    timeOut

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({mode})
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
                        console.warn(data, count)
                    })
            }, request.intervalTime)
        } else {
            clearInterval(timeOut)
        }

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        sendResponse({
            countRequests: count,
        });
    }
);
