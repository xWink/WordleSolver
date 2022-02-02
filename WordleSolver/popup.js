const WORDLE_URL = 'https://www.powerlanguage.co.uk/wordle/'

const navButton = document.getElementById('playButton')
navButton.addEventListener('click', async () => {
    await chrome.tabs.update({
        url: WORDLE_URL
    })
})

const guessButton = document.getElementById('guessButton')
guessButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.url !== WORDLE_URL) {
        return alert('Open Wordle first!')
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['guess.js'],
    })
})

const solveButton = document.getElementById('solveButton')
solveButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.url !== WORDLE_URL) {
        return alert('Open Wordle first!')
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['solve.js'],
    })
})
