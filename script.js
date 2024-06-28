const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const twoPlayerButton = document.getElementById('two-player');
const vsComputerButton = document.getElementById('vs-computer');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let vsComputer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(againstComputer) {
    vsComputer = againstComputer;
    gameActive = true;
    board.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    document.getElementById('game-mode').classList.add('hidden');
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (gameActive && vsComputer && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = currentPlayer;
        cells[randomIndex].textContent = currentPlayer;
        checkResult();
    }
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = `Game ended in a draw!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');

    if (vsComputer && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
twoPlayerButton.addEventListener('click', () => startGame(false));
vsComputerButton.addEventListener('click', () => startGame(true));