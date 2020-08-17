import Field from "./models/field.js"
import {EmptyMarking} from "./models/markings.js";


window.onload = function generateField() {
    document.getElementById("restart").addEventListener("click", () => resetGame())
    const appElement = document.getElementById("app");
    let lastMark = new EmptyMarking();
    let gameActive;
    let gameSize;
    let gameField;
    resetGame();

    function promptGameSize() {
        while (!Number.isInteger(gameSize)) {
            gameSize = parseInt(prompt("Welcome to Singleton!\nHow large would you like your game to be?"))
        }
    }

    function resetGame() {
        gameActive = true;
        gameSize = undefined;
        promptGameSize()
        document.documentElement.style.setProperty('--game-size', gameSize)
        gameField = Field.createDefault(gameSize);
        refreshGameContainer();
    }

    function refreshGameContainer() {
        appElement.innerHTML = "";
        for (const position of gameField.getAllPositions()) {
            addPositionToPage(position);
        }
    }

    function promptGameRestart(message) {
        if (confirm(message)) {
            resetGame();
        } else {
            gameActive = false;
        }
    }

    function handleClick(xCoord, yCoord) {
        if (!gameActive) {
            promptGameRestart("The game has finished. Would you like to start a new game?")
            return;
        }
        const position = gameField.getPosition(xCoord, yCoord);
        const newMarking = lastMark.nextMarkingCreator();
        position.markAs(newMarking)
        lastMark = newMarking;
        refreshGameContainer();

        if (gameField.getVictories().length !== 0) {
            promptGameRestart(gameField.getVictories() + " has won!\nDo you want to start a new game?");
        }
    }

    function addPositionToPage(position) {
        const positionElement = cloneTemplate("position");
        const markingElement = cloneTemplate(position.getMarkingTemplateId());

        const positionContentElement = positionElement.querySelector("#position-content");
        positionContentElement.dataset.xCoord = position.xCoord;
        positionContentElement.dataset.yCoord = position.yCoord;

        positionContentElement.addEventListener("click", function(event) {
            const xCoord = event.currentTarget.dataset.xCoord;
            const yCoord = event.currentTarget.dataset.yCoord;
            handleClick(parseInt(xCoord), parseInt(yCoord));
        });

        positionContentElement.append(markingElement)

        appElement.append(positionElement);
    }
}


function cloneTemplate(id) {
    return document
        .getElementById(id)
        .content
        .cloneNode(true);
}
