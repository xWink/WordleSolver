solve()

function solve() {
    removeHelpModal()
    chrome.storage.sync.get('startDateMs', ({ startDateMs }) => {
        const startDay = Math.floor(startDateMs / 8.64e7)
        const today = Math.floor((Date.now() - 2.88e7) / 8.64e7)
        const answerIndex = today - startDay
        const answerRowName = `answerRow${Math.floor(answerIndex / 1000)}`
        chrome.storage.sync.get(answerRowName, (answerRowObj) => {
            const answerRow = answerRowObj[answerRowName]
            const answer = answerRow[answerIndex % answerRow.length]
            guessWord(answer)
        })
    })
}

function guessWord(word) {
    const keys = getKeyboardKeys()
    if (keys.length === 0) {
        return alert('Open Wordle in order to solve!')
    }
    clearGuess(keys)
    for (let letter of word) {
        clickKey(keys, letter)
    }
    clickKey(keys, '↵')
}

function clearGuess(keys) {
    for (let i = 0; i < 6; i++) {
        clickKey(keys, '←')
    }
}

function getKeyboardKeys() {
    const keyboardRows = document.querySelector('game-app')
        ?.shadowRoot
        ?.querySelector('game-theme-manager')
        ?.querySelector('#game')
        ?.querySelector('game-keyboard')
        ?.shadowRoot
        ?.querySelector('#keyboard')
        ?.querySelectorAll('div')

    return Array.from(keyboardRows || [])
        .flatMap(row => Array.from(row?.querySelectorAll('button')))
}

function clickKey(keys, keyText) {
    keys.find((key) => key.getAttribute('data-key') === keyText)?.click()
}

function removeHelpModal() {
    document.querySelector('game-app')
        ?.shadowRoot
        ?.querySelector('game-theme-manager')
        ?.querySelector('#game')
        ?.querySelector('game-modal')
        ?.shadowRoot
        ?.querySelector('.overlay')
        ?.querySelector('.content')
        ?.querySelector('.close-icon')
        ?.click()
}
