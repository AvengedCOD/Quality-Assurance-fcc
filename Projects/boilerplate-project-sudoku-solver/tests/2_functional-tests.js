const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings.js');

const assert = chai.assert;
chai.use(chaiHttp);

suite('Functional Tests', () => {

  const [validPuzzle, solution] = puzzles.puzzlesAndSolutions[0];

  suite('POST /api/solve', () => {

    test('Solve a puzzle with valid puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field missing' });
          done();
        });
    });

    test('Solve a puzzle with invalid characters', done => {
      const puzzle = validPuzzle.replace('.', 'a');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Solve a puzzle with incorrect length', done => {
      const puzzle = validPuzzle.slice(0, 80);
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', done => {
      const unsolvable = '1'.repeat(81);
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: unsolvable })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
          done();
        });
    });
  });

  suite('POST /api/check', () => {

    test('Check a puzzle placement with all fields', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '1' }) 
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isTrue(res.body.conflict.includes('row'));
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' }) 
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isAtLeast(res.body.conflict.length, 2);
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'H1', value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, value: '3' }) 
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', done => {
      const invalidPuzzle = validPuzzle.replace('.', 'x');
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', done => {
      const shortPuzzle = validPuzzle.slice(0, 80);
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: shortPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: 'x' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
    });

  });

});
