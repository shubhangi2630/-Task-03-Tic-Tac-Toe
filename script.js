const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const newGameButton = document.getElementById("newGame");
const resetScoreButton = document.getElementById("resetScore");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

const modeButtons = document.querySelectorAll(".mode-btn");

let board = ["", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "pvp";

let scoreX = 0;
let scoreO = 0;


const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = cell.dataset.index;

        if (board[index] !== "" || !gameActive) {
            return;
        }

        makeMove(index, currentPlayer);

        if (!gameActive) {
            return;
        }

        if (gameMode === "computer" && currentPlayer === "O") {

            setTimeout(computerMove, 500);

        }

    });

});


function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(player.toLowerCase());

    checkGame();

}


function checkGame() {

    let winnerFound = false;

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winnerFound = true;

            highlightWinner(pattern);

            endGame(board[a]);

            break;
        }

    }

    if (!winnerFound && !board.includes("")) {

        endGame("draw");

        return;
    }

    if (!winnerFound) {

        switchPlayer();

    }

}


function switchPlayer() {

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer}'s turn`;

}


function endGame(result) {

    gameActive = false;

    if (result === "draw") {

        statusText.textContent = "It's a draw! 🤝";

        return;
    }

    statusText.textContent = `Player ${result} wins! 🏆`;

    if (result === "X") {

        scoreX++;

        scoreXElement.textContent = scoreX;

    } else {

        scoreO++;

        scoreOElement.textContent = scoreO;

    }

}


function highlightWinner(pattern) {

    pattern.forEach(index => {

        cells[index].classList.add("winner");

    });

}


function computerMove() {

    if (!gameActive) {
        return;
    }

    const emptyCells = [];

    board.forEach((cell, index) => {

        if (cell === "") {
            emptyCells.push(index);
        }

    });

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomIndex, "O");

}


function resetGame() {

    board = ["", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x", "o", "winner");

    });

    statusText.textContent = "Player X's turn";

}


newGameButton.addEventListener("click", resetGame);


resetScoreButton.addEventListener("click", () => {

    scoreX = 0;

    scoreO = 0;

    scoreXElement.textContent = "0";

    scoreOElement.textContent = "0";

    resetGame();

});


modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        gameMode = button.dataset.mode;

        resetGame();

        if (gameMode === "computer") {

            statusText.textContent = "Your turn — Player X";

        }

    });

});
