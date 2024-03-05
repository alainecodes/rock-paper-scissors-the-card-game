const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    playerSides: {
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX: document.querySelector('#computer-cards')
    },
    actions: {
        button: document.getElementById('next-duel')
    }
}

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards'
}

const pathImages = './src/assets/icons/'

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement('img')
    cardImage.setAttribute('src', './src/assets/icons/card-back.png')
    cardImage.setAttribute('height', '100px')
    cardImage.setAttribute('data-id', cardId)
    cardImage.classList.add('card')

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener('mouseover', () => drawSelectedCard(cardId))

        cardImage.addEventListener('click', () => {
            setCardsInField(cardImage.getAttribute('data-id'))
        })
    }
    return cardImage
}

async function setCardsInField(cardId) {

    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    await showHiddenCardFieldsImages(true)

    await hideCardDetails()

    await drawCardsInFIeld(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function drawCardsInFIeld(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = 'block'
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = 'block'
        state.fieldCards.computer.style.display = 'block'
    } else {
        state.fieldCards.player.style.display = 'none'
        state.fieldCards.computer.style.display = 'none'
    }
}
async function hideCardDetails() {
    state.cardSprites.avatar.src = ''
    state.cardSprites.name.innerText = ''
    state.cardSprites.type.innerText = ''
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw!"
    let playerCard = cardData[playerCardId]

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "You Win!"
        await playAudio('win')
        state.score.playerScore++
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "You Lose!"
        await playAudio('lose')
        state.score.computerScore++
    }

    return duelResults
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides
    let imgElements = computerBOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())

    cards = state.playerSides.player1BOX
    imgElements = player1BOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())
}

async function drawSelectedCard(cardId) {
    state.cardSprites.avatar.src = cardData[cardId].img
    state.cardSprites.name.innerText = cardData[cardId].name
    state.cardSprites.type.innerText = `Attribute: ${cardData[cardId].type}`
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomCardId = await getRandomCardId()
        const cardImage = await createCardImage(randomCardId, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = ''
    state.actions.button.style.display = 'none'
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'
    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        audio.play()
    } catch (error) { }
}

function init() {
    const bgm = document.getElementById('bgm')
    bgm.play()

    showHiddenCardFieldsImages(false)

    drawCards(5, playerSides.player1),
        drawCards(5, playerSides.computer)

}

init()