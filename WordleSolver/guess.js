guess()

function guess() {
    removeHelpModal()
    const gameRows = getEvaluatedGameRows() // guess history
    const correctLetters = getLetters(gameRows, 'correct')
    const presentLetters = getLetters(gameRows, 'present')
    const absentLetters = getLetters(gameRows, 'absent')
    const regex = generateRegex(correctLetters, presentLetters, absentLetters)
    withAllPossibleAnswers(answers => {
        const possibleAnswers = answers.filter(answer => answer.match(regex) && presentLetters.every(letter => answer.includes(letter.letter)))
        const word = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]
        guessWord(word)
    })
}

function generateRegex(correctLetters, presentLetters, absentLetters) {
    const allowedChars = '[abcdefghijklmnopqrstuvwxyz]'
    let regexElements = [allowedChars, allowedChars, allowedChars, allowedChars, allowedChars]

    for (let presentLetter of presentLetters) {
        regexElements[presentLetter.index] = regexElements[presentLetter.index].replace(presentLetter.letter, '')
    }

    for (let absentLetter of absentLetters) {
        const letterIsPresent = presentLetters.some(presentLetter => presentLetter.letter === absentLetter.letter)
        if (letterIsPresent) {
            // Remove from one index
            regexElements[absentLetter.index] = regexElements[absentLetter.index].replace(absentLetter.letter, '')
        } else {
            // Remove from all indices
            for (let i = 0; i < regexElements.length; i++) {
                console.log(absentLetter.letter)
                regexElements[i] = regexElements[i].replace(absentLetter.letter, '')
            }
        }
    }

    for (let correctLetter of correctLetters) {
        regexElements[correctLetter.index] = correctLetter.letter
    }

    return regexElements.join('')
}

function getEvaluatedGameRows() {
    const gameRows = document.querySelector('game-app')
        ?.shadowRoot
        ?.querySelector('game-theme-manager')
        ?.querySelector('#game')
        ?.querySelector('#board-container')
        ?.querySelector('#board')
        ?.querySelectorAll('game-row')

    return Array.from(gameRows || [])
        .filter(gameRow => isEvaluated(gameRow))
}

// Get first letter of a row and check if it has an evaluation
function isEvaluated(gameRow) {
    const evaluation = gameRow?.shadowRoot
        ?.querySelector('.row')
        ?.querySelector('game-tile')
        ?.getAttribute('evaluation')

    return evaluation !== undefined && evaluation !== null
}

function getLetters(gameRows, evaluation) {
    const correctLetters = []
    for (let gameRow of gameRows) {
        const gameTiles = Array.from(gameRow.shadowRoot
            .querySelector('.row')
            .querySelectorAll('game-tile'))

        for (let i = 0; i < gameTiles.length; i++) {
            if (gameTiles[i].getAttribute('evaluation') === evaluation) {
                correctLetters.push({
                    letter: gameTiles[i].getAttribute('letter'),
                    index: i
                })
            }
        }
    }
    return correctLetters
}

function withAllPossibleAnswers(callback) {
    const possibleAnswers = []
    chrome.storage.sync.get('answerRow0', (answerRowObj) => {
        possibleAnswers.push(...answerRowObj['answerRow0'])
        chrome.storage.sync.get('answerRow1', (answerRowObj) => {
            possibleAnswers.push(...answerRowObj['answerRow1'])
            chrome.storage.sync.get('answerRow2', (answerRowObj) => {
                possibleAnswers.push(...answerRowObj['answerRow2'])
                callback(possibleAnswers)
            })
        })
    })
}

function guessWord(word) {
    const keys = getKeyboardKeys()
    if (keys.length === 0) {
        return alert('Open Wordle in order to guess!')
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
