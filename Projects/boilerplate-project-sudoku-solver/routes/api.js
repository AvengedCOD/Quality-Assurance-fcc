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
      
    });
    
};
