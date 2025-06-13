function ConvertHandler() {
  
  // Extract number, check for invalid combinations, and perform division if needed
  this.getNum = function(input) {
    input = input.trim();

    let numberMatch = input.match(/^([0-9\.\/]+)/);

    if (!numberMatch) {
      return 1;
    }

    let numberString = numberMatch[1 ];

    if (numberString.split('/').length - 1 > 1) {
      return undefined;
    }

    if (numberString.indexOf('/') !== -1) {
      let [numerator, denominator] = numberString.split('/');
      if (isNaN(numerator) ||
          isNaN(denominator) ||
          Number(denominator) == 0) {
        return undefined;
      }
      return parseFloat(numerator) / parseFloat(denominator);
    } else {
      let result = parseFloat(numberString);
      if (isNaN(result)) return undefined;
      return result;
    }
  };
  
  // Check for unit, then validate the unit
  this.getUnit = function(input) {
    input = input.trim();
  
    let match = input.match(/[a-zA-Z]+$/);
    if (!match) return undefined;
  
    let unit = match[0].toLowerCase();
  
    if ( ['gal', 'l', 'mi', 'km', 'lbs', 'kg'].indexOf(unit) === -1 ) {
      return undefined;
    }
  
    return (unit === 'l') ? 'L' : unit;
  };
  
  // Pair with appropriate unit for conversion
  this.getReturnUnit = function(initUnit) {
    const pairs = {
      gal: 'L',
      L: 'gal',
      lbs: 'kg',
      kg: 'lbs',
      mi: 'km',
      km: 'mi'
    };
    return pairs[initUnit];
  };

  // Define names for each unit
  this.spellOutUnit = function(unit) {
    const fullNames = {
      gal: 'gallons',
      L: 'liters',
      lbs: 'pounds',
      kg: 'kilograms',
      mi: 'miles',
      km: 'kilometers'
    };
    return fullNames[unit];
  };
  
  // Perform conversion based on initial unit
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
  
    if (initUnit === 'gal') return initNum * galToL;
    if (initUnit === 'L') return initNum / galToL;
  
    if (initUnit === 'lbs') return initNum * lbsToKg;
    if (initUnit === 'kg') return initNum / lbsToKg;
  
    if (initUnit === 'mi') return initNum * miToKm;
    if (initUnit === 'km') return initNum / miToKm;
  
    return undefined;
  };
  
  // Put into a string for display
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum.toFixed(5)} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
