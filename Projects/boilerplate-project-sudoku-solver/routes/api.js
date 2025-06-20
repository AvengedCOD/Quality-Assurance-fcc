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

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) return res.json({ error: validation });

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0];
      const col = parseInt(coordinate[1]);

      const currentChar = puzzle[(row.charCodeAt(0) - 65) * 9 + (col - 1)];
      if (currentChar === value) return res.json({ valid: true });

      let conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });
    
};
