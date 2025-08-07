class SudokuSolver {
  validate(puzzleString) {
    const sudukoRegex = /^[1-9.]+$/;
    if (!puzzleString) return 'Required field missing'; 
    if (!sudukoRegex.test(puzzleString)) return 'Invalid characters in puzzle';
    if (puzzleString.length !== 81) return 'Expected puzzle to be 81 characters long';
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return false;
    
    for (let i = 0; i < 9; i++) {
      if (i !== colIndex) {
        const cellValue = puzzleString[rowIndex * 9 + i];
        if (cellValue === value) return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return false;
    
    for (let i = 0; i < 9; i++) {
      const cellValue = puzzleString[i * 9 + colIndex];
      if (i !== rowIndex && cellValue === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    let colIndex = column - 1;
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return false;
    
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

  isValidPlacement(boardString, row, col, value) {
    const rowLetter = String.fromCharCode(65 + row);
    return (
      this.checkRowPlacement(boardString, rowLetter, col + 1, value) &&
      this.checkColPlacement(boardString, rowLetter, col + 1, value) &&
      this.checkRegionPlacement(boardString, rowLetter, col + 1, value)
    );
  }

  isValidPuzzle(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== '.') {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const value = puzzleString[i];
        const tempPuzzle = puzzleString.substring(0, i) + '.' + puzzleString.substring(i + 1);
        if (!this.isValidPlacement(tempPuzzle, row, col, value)) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) return null;
    if (!this.isValidPuzzle(puzzleString)) return null;
    
    const board = puzzleString.split('');
    
    const solveHelper = (pos) => {
      if (pos === 81) return true;
      if (board[pos] !== '.') return solveHelper(pos + 1);
      
      for (let num = 1; num <= 9; num++) {
        const value = String(num);
        const row = Math.floor(pos / 9);
        const col = pos % 9;
        
        if (this.isValidPlacement(board.join(''), row, col, value)) {
          board[pos] = value;
          if (solveHelper(pos + 1)) return true;
          board[pos] = '.';
        }
      }
      return false;
    };
    
    if (!solveHelper(0)) return null;
    return board.join('');
  }
}

module.exports = SudokuSolver;