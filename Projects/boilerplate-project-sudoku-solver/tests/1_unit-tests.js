const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const puzzles = require('../controllers/puzzle-strings.js'); 
let solver = new SudokuSolver();

suite('Unit Tests', () => {

  test('1. Logic handles a valid puzzle string of 81 characters', () => {
    const valid = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.validate(valid);
    assert.strictEqual(result, true);
  });

  test('2. Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalid = '1.5..2.84..63.12.7a..5..7..9..1....8.2.3674.3...9..5.1.7...3..18..2...6.9..4..5.7.';
    const result = solver.validate(invalid);
    assert.strictEqual(result, 'Invalid characters in puzzle');
  });

  test('3. Logic handles a puzzle string that is not 81 characters in length', () => {
    const short = '1.5..2.84..63.12.7.2..5..7..9..1....8.2.3674.3...9..5.1.7...3..18..2...6.9..4..';
    const result = solver.validate(short);
    assert.strictEqual(result, 'Expected puzzle to be 81 characters long');
  });

  test('4. Logic handles a valid row placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkRowPlacement(puzzle, 'A', 2, '3');
    assert.strictEqual(result, true);
  });

  test('5. Logic handles an invalid row placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkRowPlacement(puzzle, 'A', 2, '1'); 
    assert.strictEqual(result, false);
  });

  test('6. Logic handles a valid column placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkColPlacement(puzzle, 'A', 2, '4');
    assert.strictEqual(result, true);
  });

  test('7. Logic handles an invalid column placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkColPlacement(puzzle, 'B', 1, '1'); 
    assert.strictEqual(result, false);
  });

  test('8. Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkRegionPlacement(puzzle, 'A', 2, '4');
    assert.strictEqual(result, true);
  });

  test('9. Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = puzzles.puzzlesAndSolutions[0][0];
    const result = solver.checkRegionPlacement(puzzle, 'A', 1, '5'); 
    assert.strictEqual(result, false);
  });

  test('10. Valid puzzle strings pass the solver', () => {
    const [puzzle, solution] = puzzles.puzzlesAndSolutions[0];
    const result = solver.solve(puzzle);
    assert.strictEqual(result, solution);
  });

  test('11. Invalid puzzle strings fail the solver', () => {
    const invalid = '1.5..2.84..63.12.7a..5..7..9..1....8.2.3674.3...9..5.1.7...3..18..2...6.9..4..5.7.';
    const result = solver.solve(invalid);
    assert.isNull(result);
  });

  test('12. Solver returns the expected solution for an incomplete puzzle', () => {
    const [puzzle, solution] = puzzles.puzzlesAndSolutions[0];
    const result = solver.solve(puzzle);
    assert.strictEqual(result, solution);
  });

});
