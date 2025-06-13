const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){

  test('convertHandler should correctly read a whole number input', function() {
    let input = '55L';
    let expected = 55;
    assert.strictEqual(convertHandler.getNum(input), expected);
  });

  test('convertHandler should correctly read a decimal number input', function() {
    let input = '3.1mi';
    let expected = 3.1;
    assert.strictEqual(convertHandler.getNum(input), expected);
  });

  test('convertHandler should correctly read a fractional input', function() {
    let input = '1/2mi';
    let expected = 0.5;
    assert.strictEqual(convertHandler.getNum(input), expected);
  });

  test('convertHandler should correctly read a fractional input with a decimal', function() {
    let input = '4.5/1.5km';
    let expected = 3;
    assert.strictEqual(convertHandler.getNum(input), expected);
  });

  test('convertHandler should correctly return an error on a double-fraction', function() {
    let input = '4/2/5lbs';
    assert.isUndefined(convertHandler.getNum(input));
  });

  test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function() {
    let input = 'mi';
    let expected = 1;
    assert.strictEqual(convertHandler.getNum(input), expected);
  });

  test('convertHandler should correctly read each valid input unit', function() {
    let validUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    validUnits.forEach(unit => {
        assert.strictEqual(convertHandler.getUnit('12' + unit), unit);
    });
  });

  test('convertHandler should correctly return an error for an invalid input unit', function() {
    let input = '37cm';
    assert.isUndefined(convertHandler.getUnit(input));
  });

  test('convertHandler should return the correct return unit for each valid input unit', function() {
    let inputUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    let expectedUnits = ['L', 'gal', 'km', 'mi', 'kg', 'lbs'];
    inputUnits.forEach((unit, i) => {
        assert.strictEqual(convertHandler.getReturnUnit(unit), expectedUnits[i]);
    });
  });

  test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function() {
    let inputUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    let spelledUnits = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
    inputUnits.forEach((unit, i) => {
        assert.strictEqual(convertHandler.spellOutUnit(unit), spelledUnits[i]);
    });
  });

  test('convertHandler should correctly convert gal to L', function() {
    let inputNum = 5;
    let inputUnit = 'gal';
    let expected = 5 * 3.78541;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

  test('convertHandler should correctly convert L to gal', function() {
    let inputNum = 5;
    let inputUnit = 'L';
    let expected = 5 / 3.78541;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

  test('convertHandler should correctly convert mi to km', function() {
    let inputNum = 3;
    let inputUnit = 'mi';
    let expected = 3 * 1.60934;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

  test('convertHandler should correctly convert km to mi', function() {
    let inputNum = 3;
    let inputUnit = 'km';
    let expected = 3 / 1.60934;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

  test('convertHandler should correctly convert lbs to kg', function() {
    let inputNum = 10;
    let inputUnit = 'lbs';
    let expected = 10 * 0.453592;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

  test('convertHandler should correctly convert kg to lbs', function() {
    let inputNum = 10;
    let inputUnit = 'kg';
    let expected = 10 / 0.453592;
    assert.approximately(convertHandler.convert(inputNum, inputUnit), expected, 0.1);
  });

});