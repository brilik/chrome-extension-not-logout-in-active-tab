// Initializes button with user's preferred color
const modeBtn = document.getElementById('changeMode')
const intervalLabel = document.getElementById('periodsLabel')
const periodsHelperText = document.getElementById('periodsHelperText')
const periodsTime = document.getElementById('periodsTime')
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
    } else { // turn off
        modeBtn.innerText = chrome.i18n.getMessage('activate')
        modeBtn.classList.remove('active')
    }
})

modeBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})

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
        })
    })

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: sendRequest,
        args: [intervalTime],
    })
})

const sendRequest = (intervalTime) => {
    setInterval(() => {
        fetch(window.location.href, {method: 'GET'}
        ).then((data) => {
            console.warn(data)
        })
    }, intervalTime)
}
