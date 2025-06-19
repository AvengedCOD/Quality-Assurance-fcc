class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[0-9.]+$/;
    if (!puzzleString) return 'Required field missing'; 
    if (!regex.test(puzzleString)) return 'Invalid characters in puzzle';
    if (puzzleString.length !== 81) return'Expected puzzle to be 81 characters long';
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

