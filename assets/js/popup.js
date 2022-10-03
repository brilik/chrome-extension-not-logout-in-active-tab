// Initializes button with user's preferred color
const modeBtn = document.getElementById('changeMode')
const intervalLabel = document.getElementById('periodsLabel')
const periodsHelperText = document.getElementById('periodsHelperText')
const displayCounterRequests = document.getElementById('counterRequests')
const debug = async (...e) => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: (...f) => {
            console.log(...f)
        },
        args: [...e]
    })
}
intervalLabel.textContent = chrome.i18n.getMessage('periodicity')
periodsHelperText.textContent = chrome.i18n.getMessage('minute')

chrome.storage.sync.get(['mode'], ({mode}) => {
    if (mode) { // turn on
        modeBtn.innerText = chrome.i18n.getMessage('deactivate')
        modeBtn.classList.add('active')
        chrome.action.setBadgeText({text: 'on'})
    } else { // turn off
        modeBtn.innerText = chrome.i18n.getMessage('activate')
        modeBtn.classList.remove('active')
        chrome.action.setBadgeText({text: 'off'})
    }
})

chrome.storage.sync.get('counterRequests', (response) => {
    displayCounterRequests.innerText = response.counterRequests.toString()
})
setInterval(() => {
    chrome.storage.sync.get('counterRequests', (response) => {
        displayCounterRequests.innerText = response.counterRequests.toString()
    })
}, 500)

modeBtn.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

        chrome.storage.sync.get(['mode'], ({mode}) => {
            chrome.storage.sync.set({mode: !mode}).then(() => {
                const periodsTime = document.getElementById('periodsTime')
                const intervalTime = periodsTime.value ? periodsTime.value * 1000 : 5 * 1000
                const url = tabs[0].url

                if (!mode) { // turn on
                    modeBtn.innerText = chrome.i18n.getMessage('deactivate')
                    modeBtn.classList.add('active')
                    chrome.action.setBadgeText({text: 'on'})
                    chrome.storage.sync.set({counterRequests: 0})
                } else { // turn off
                    modeBtn.innerText = chrome.i18n.getMessage('activate')
                    modeBtn.classList.remove('active')
                    chrome.action.setBadgeText({text: 'off'})
                }

                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: (data) => {
                        chrome.runtime.sendMessage(data, (response) => {
                            console.group('%cNotLogoutInActiveTab', `color: dodgerblue`)
                            if (response)
                                console.log(response)
                            console.groupEnd()
                        })
                    },
                    args: [{
                        mode: !mode,
                        tabID: tabs[0].id,
                        intervalTime: intervalTime,
                        locationHref: url,
                    }],
                })
            })
        })
    })
})
