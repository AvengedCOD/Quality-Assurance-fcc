class SudokuSolver {

  validate(puzzleString) {
    const sudukoRegex = /^[0-9.]+$/;

    if (!puzzleString) return 'Required field missing'; 
    if (!sudukoRegex.test(puzzleString)) return 'Invalid characters in puzzle';
    if (puzzleString.length !== 81) return'Expected puzzle to be 81 characters long';

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (this.validate(puzzleString) !== true) return null;

    let rows = puzzleString.match(/.{9}/g);
    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return null;

    for (let i = 0; i < 9; i++) { if (i !== colIndex && rows[rowIndex][i] === value) return false; }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (this.validate(puzzleString) !== true) return null;

    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return null;

    for (let i = 0; i < 9; i++) {
      const cellValue = puzzleString[i * 9 + colIndex];
      if (i !== rowIndex && cellValue === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (this.validate(puzzleString) !== true) return null;

    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return null;

    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === rowIndex && c === colIndex) continue;
        if (puzzleString[r * 9 + c] === value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) return null;

    const board = puzzleString.split('').map(c => c === '.' ? '.' : c);
    const solveHelper = (pos) => {
      if (pos === 81) return true;
      if (board[pos] !== '.') return solveHelper(pos + 1);

      for (let num = 1; num <= 9; num++) {
        const value = String(num);
        const row = Math.floor(pos / 9);
        const col = pos % 9;
        const rowLetter = String.fromCharCode(65 + row);

        if (
          this.checkRowPlacement(board.join(''), rowLetter, col + 1, value) &&
          this.checkColPlacement(board.join(''), rowLetter, col + 1, value) &&
          this.checkRegionPlacement(board.join(''), rowLetter, col + 1, value)) {
            board[pos] = value;
            if (solveHelper(pos + 1)) return true;
            board[pos] = '.';
          }
        }
        return false;
    };

    if (!solveHelper(0)) return false;
    return board.join('');
  }
}

module.exports = SudokuSolver;

