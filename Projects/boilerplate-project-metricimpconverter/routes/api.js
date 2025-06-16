'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  // API routes
  app.get('/api/convert', (req, res) => {
    const input = req.query.input;
    if (!input) {
      return res.json({error: 'No input provided'})
    }

    // Conversion and Error Check
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    
    if (initNum === undefined && initUnit === undefined) {
      return res.json('invalid number and unit');
    }
    if (initNum === undefined && initUnit !== undefined) {
      return res.json('invalid number');
    }
    if (initNum !== undefined && initUnit === undefined) {
      return res.json('invalid unit');
    }
    
    const returnNumUnfixed = convertHandler.convert(initNum, initUnit);
    const returnNum = parseFloat(returnNumUnfixed.toFixed(5));
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    // Return Completed Conversion json
    res.json({ initNum, initUnit, returnNum, returnUnit, string });
  });

};
