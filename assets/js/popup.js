// Initializes button with user's preferred color
const modeBtn = document.getElementById('changeMode')
const intervalLabel = document.getElementById('periodsLabel')
const periodsHelperText = document.getElementById('periodsHelperText')
const periodsTime = document.getElementById('periodsTime')

intervalLabel.textContent = chrome.i18n.getMessage('periodicity')
periodsHelperText.textContent = chrome.i18n.getMessage('minute')

chrome.storage.sync.get(['mode'], ({mode}) => {
    if (mode) { // turn on
        modeBtn.innerText = chrome.i18n.getMessage('deactivate')
        modeBtn.classList.add('active')
    } else { // turn off
        modeBtn.innerText = chrome.i18n.getMessage('activate')
        modeBtn.classList.remove('active')
    }
})

modeBtn.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let intervalTime = periodsTime.value ? periodsTime.value * 60 * 1000 : 5 * 60 * 1000

        chrome.storage.sync.get(['mode'], ({mode}) => {
            chrome.storage.sync.set({mode: !mode}).then(() => {
                if (!mode) { // turn off
                    modeBtn.innerText = chrome.i18n.getMessage('deactivate')
                    modeBtn.classList.add('active')
                } else { // turn on
                    modeBtn.innerText = chrome.i18n.getMessage('activate')
                    modeBtn.classList.remove('active')
                }

                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: (data) => {
                        chrome.runtime.sendMessage(data, (response) => {
                            console.group('NotLogoutInActiveTab')
                            console.log(response)
                            console.groupEnd()
                        })
                    },
                    args: [{
                        mode: !mode,
                        tab: tabs[0].id,
                        intervalTime: intervalTime,
                        locationHref: window.location.href,
                    }],
                })
            })
        })
    })
})
