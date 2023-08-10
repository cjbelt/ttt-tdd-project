const Screen = require('./screen');

class ComputerPlayer {
  static nextMove;

  static checkWin(grid) {
    let total = 0;
    const declareWinner = function(X, O) {
      if (X === 3) {
        return "X";
      } else if (O === 3) {
        return "O";
      } else {
        return false;
      }
    }

    const countMoves = function(i, j, values = {
      X: 0,
      O: 0
    }) {
       if (grid[i][j] === "X") {
        values.X++;
      } else if (grid[i][j] === "O") {
        values.O++;
      }

      return values;
    }

    // horizontal checking
    for (let i = 0; i < grid.length; i++) {
      let values = {
        X: 0,
        O: 0
      }
      for (let j = 0; j < grid[i].length; j++) {
        values = countMoves(i, j, values);
      }
      if (declareWinner(values.X, values.O)) {
        return declareWinner(values.X, values.O);
      }
    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended
    }

    // vertical checking
    for (let j = 0; j < grid[0].length; j++) {
      let values = {
        X: 0,
        O: 0
      }
      for (let i = 0; i < grid.length; i++) {
        values = countMoves(i, j, values);
      }

      if (declareWinner(values.X, values.O)) {
        return declareWinner(values.X, values.O);
      }
    }

    // diagonal checking
    let values = {
      X: 0,
      O: 0,
    }
    let j = grid[0].length - 1;

    for (let i = 0; i < grid.length; i++) {
      values = countMoves(i, i, values);
    }

    if (declareWinner(values.X, values.O)) {
      return declareWinner(values.X, values.O);
    }

    values.X = 0;
    values.O = 0;

    for (let i = 0; i < grid.length; i++) {
     values = countMoves(i, j, values);

      j--;
    }

    if (declareWinner(values.X, values.O)) {
      return declareWinner(values.X, values.O);
    }

     // check tie
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === "X" || grid[i][j] === "O") {
          total++;
        }
      }
    }

    if (total === grid.length * grid[0].length) {
      return "T";
      }

    return false;
  }

  static getValidMoves(grid) {
    // Your code here
    const moves = [];

    for (let i = 0; i < grid.length; i++) {
      const row = i;
      for (let j = 0; j < grid[i].length; j++) {
        const col = j;
        if (grid[row][col] === " ") {
          moves.push({row, col});
        }
      }
    }

    return moves;
  }

  static randomMove(grid) {
    // Your code here
    const moves = ComputerPlayer.getValidMoves(grid);
    const randomNum = Math.floor(Math.random() * moves.length);

    return moves[randomNum];
  }

  static getWinningMoves(grid, symbol) {

    // Your code here
    const countSymbol = function(symbol, count, i, j) {
      if (grid[i][j] === symbol) {
        count++;
      }

      return count;
    }

    let remaining = {};

    const findRemaining = function(i, j) {
      if (grid[i][j] === " ") {
        remaining.row = i;
        remaining.col = j;
      }
    }


    // horizontal checking
    for (let i = 0; i < grid.length; i++) {
      let count = 0;
      for (let j = 0; j < grid[i].length; j++) {
        count = countSymbol(symbol, count, i, j);
      }

      if (count === 2) {
        const move = ComputerPlayer.getValidMoves(grid).reduce((accum, element) => {
          if (element.row === i) {
            return element;
          }

          return accum;
        }, null);

        if (move) return move;
      }
    }

    // vertical checking
    for (let j = 0; j < grid[0].length; j++) {
      let count = 0;

      for (let i = 0; i < grid.length; i++) {
        count = countSymbol(symbol, count, i, j);
      }

      if (count === 2) {
        const move = ComputerPlayer.getValidMoves(grid).reduce((accum, element) => {
          if (element.col === j) {
            return element;
          }

          return accum;
        }, null);

        if (move) return move;
      }
    }

    // diagonal checking
    let j = 0;
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      count = countSymbol(symbol, count, i, j);
      findRemaining(i, j);

      j++;
    }

    if (count === 2) {
      const move = ComputerPlayer.getValidMoves(grid).reduce((accum, element) => {

        if (element.row === remaining.row && element.col === remaining.col) {
          return element;
        }

        return accum;
      }, null);

      if (move) return move;
    }


    j = grid[0].length - 1;
    count = 0;

    for (let i = 0; i < grid.length; i++) {
      count = countSymbol(symbol, count, i, j);
      findRemaining(i, j);

      j--;
    }

    if (count === 2) {
      const move = ComputerPlayer.getValidMoves(grid).reduce((accum, element) => {

        if (element.row === remaining.row && element.col === remaining.col) {
          return element;
        }

        return accum;
      }, null);

      if (move) return move;
    }

  }

  // minimax algorithm, based on Garrett's Tic Tac Toe https://codepen.io/garbot/pen/bWLGGL
  static minimax(grid, symbol, depth = 0) {

    let opponent = symbol === "X" ? "O" : "X";

    const winner = ComputerPlayer.checkWin(grid);

    if (!winner) {
      // make a deep copy of the grid
      let newGrid = [];

      for (let row = 0; row < grid.length; row++) {
        newGrid.push(grid[row].slice());
      }

      const validMoves = ComputerPlayer.getValidMoves(grid);
      const score = [];

      for (let i = 0; i < validMoves.length; i++) {
        const move = validMoves[i];
        newGrid[move.row][move.col] = symbol;
        if (symbol === ComputerPlayer.symbol) {
          depth++;
          score.push(ComputerPlayer.minimax(newGrid, opponent, depth));
          depth--;
        } else {
          score.push(ComputerPlayer.minimax(newGrid, opponent, depth));
        }
        newGrid[move.row][move.col] = " ";
      }

      if (symbol === ComputerPlayer.symbol) {
        const min = ComputerPlayer.findMinIndex(score);
        ComputerPlayer.nextMove = validMoves[min];
        return score[min];
      } else {
        const max = ComputerPlayer.findMaxIndex(score)
        ComputerPlayer.nextMove = validMoves[max];
        return score[max];
      }

    } else {
      if (winner === "T") {
        return 0;
      } else if (winner === ComputerPlayer.symbol) {
        return -10 + depth;
      } else {
        return 10 - depth;
      }
    }
  }

  static findMinIndex(array) {
    let min = 0;
    let index = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] <= min) {
        min = array[i];
        index = i;
      }
    }

    return index;
  }

  static findMaxIndex(array) {
    let max = 0;
    let index = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] >= max) {
        max = array[i];
        index = i;
      }
    }

    return index;
  }

  static getSmartMove(grid, symbol) {

    // Your code here
    ComputerPlayer.minimax(grid, symbol);
    return ComputerPlayer.nextMove;
  }
}

module.exports = ComputerPlayer;
