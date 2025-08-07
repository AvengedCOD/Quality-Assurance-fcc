'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

    app.route('/api/solve')
      .post((req, res) => {
        const { puzzle } = req.body;
  
        if (!puzzle) return res.json({ error: 'Required field missing' });
  
        const validation = solver.validate(puzzle);
        if (validation !== true) return res.json({ error: validation });
  
        const solution = solver.solve(puzzle);
        if (!solution) return res.json({ error: 'Puzzle cannot be solved' });
  
        return res.json({ solution });
      });

    app.post('/api/check', (req, res) => {
      const { puzzle, coordinate, value } = req.body;
    
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
    
      const puzzleValidation = solver.validate(puzzle);
      if (puzzleValidation !== true) {
        return res.json({ error: puzzleValidation });
      }
    
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
    
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
    
      const row = coordinate[0];
      const column = parseInt(coordinate[1]);
    
      const rowIndex = row.charCodeAt(0) - 65; 
      const colIndex = column - 1; 
      const currentValue = puzzle[rowIndex * 9 + colIndex];
      
      if (currentValue === value) {
        return res.json({ valid: true });
      }
    
      const conflicts = [];
    
      const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
      const colCheck = solver.checkColPlacement(puzzle, row, column, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);
    
      if (!rowCheck) {
        conflicts.push('row');
      }
    
      if (!colCheck) {
        conflicts.push('column');
      }
    
      if (!regionCheck) {
        conflicts.push('region');
      }
    
      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    });
    
};
