const WORDLE_URL = 'https://www.nytimes.com/games/wordle/index.html'

const navButton = document.getElementById('playButton')
navButton.addEventListener('click', async () => {
    await chrome.tabs.update({
        url: WORDLE_URL
    })
})

const guessButton = document.getElementById('guessButton')
guessButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.url.startsWith('chrome://')) {
        return alert('Open Wordle in order to solve!')
    }

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['guess.js'],
    })
})

const solveButton = document.getElementById('solveButton')
solveButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.url.startsWith('chrome://')) {
        return alert('Open Wordle in order to solve!')
    }

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['solve.js'],
    })
})
