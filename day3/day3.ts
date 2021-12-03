const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const diagnosticsString: string[] = fileToString.split("\n");
  diagnosticsString.pop();
  return diagnosticsString;
};

//part 1

const countGamma = function (file: string): string {
  const diagnostics: string[] = prepFile(file);
  const numbersLength: number = diagnostics.length;
  const numbersInReport: number = diagnostics[0].length;
  let gammaBinary: string = "";
  for (let i = 0; i < numbersInReport; i++) {
    let numberzeros: number = 0;
    let numberones: number = 0;
    for (let j = 0; j < numbersLength; j++) {
      const currentnumber: string = diagnostics[j][i];
      if (currentnumber === "0") {
        ++numberzeros;
      } else if (currentnumber === "1") {
        ++numberones;
      } else {
        console.log("error; doesn't match 0 or 1");
      }
    }
    if (numberzeros >= numberones) {
      gammaBinary += "0";
    } else {
      gammaBinary += "1";
    }
  }
  return gammaBinary;
};

const countEpsilon = function (gammaBinary: string): string {
  const gammalength = gammaBinary.length;
  let epsilonBinary: string = "";
  for (let i = 0; i < gammalength; i++) {
    const currentletter = gammaBinary[i];
    if (currentletter === "0") {
      epsilonBinary += "1";
    } else {
      epsilonBinary += "0";
    }
  }
  return epsilonBinary;
};

const calculatePower = function (file: string): number {
  const gammabinary: string = countGamma(file);
  const epsilonbinary: string = countEpsilon(gammabinary);
  const gammadecimal: number = parseInt(gammabinary, 2);
  const epsilondecimal: number = parseInt(epsilonbinary, 2);
  return gammadecimal * epsilondecimal;
};

//part 2

const reduceForOxygen = function (
  inputnumbers: string[],
  currentindex: number
): string[] {
  let validatednumbers: string[] = [];
  const numbersLength: number = inputnumbers.length;
  let numberzeros: number = 0;
  let numberones: number = 0;
  for (let i = 0; i < numbersLength; i++) {
    const currentnumber: string = inputnumbers[i][currentindex];
    if (currentnumber === "0") {
      ++numberzeros;
    } else if (currentnumber === "1") {
      ++numberones;
    }
  }
  if (numberzeros > numberones) {
    for (let j = 0; j < numbersLength; j++) {
      if (inputnumbers[j][currentindex] === "0") {
        validatednumbers.push(inputnumbers[j]);
      }
    }
  } else {
    for (let j = 0; j < numbersLength; j++) {
      if (inputnumbers[j][currentindex] === "1") {
        validatednumbers.push(inputnumbers[j]);
      }
    }
  }
  return validatednumbers;
};

const findOxygenGenerator = function (file: string): string {
  const startingNumbers = prepFile(file);
  let currentIndex = 0;
  let validatedNumbers = reduceForOxygen(startingNumbers, currentIndex);
  while (validatedNumbers.length > 1) {
    currentIndex++;
    validatedNumbers = reduceForOxygen(validatedNumbers, currentIndex);
  }
  return validatedNumbers[0];
};

const reduceForCO2 = function (
  inputnumbers: string[],
  currentindex: number
): string[] {
  let validatednumbers: string[] = [];
  const numbersLength: number = inputnumbers.length;
  let numberzeros: number = 0;
  let numberones: number = 0;
  for (let i = 0; i < numbersLength; i++) {
    const currentnumber: string = inputnumbers[i][currentindex];
    if (currentnumber === "0") {
      ++numberzeros;
    } else if (currentnumber === "1") {
      ++numberones;
    }
  }
  if (numberzeros <= numberones) {
    for (let j = 0; j < numbersLength; j++) {
      if (inputnumbers[j][currentindex] === "0") {
        validatednumbers.push(inputnumbers[j]);
      }
    }
  } else {
    for (let j = 0; j < numbersLength; j++) {
      if (inputnumbers[j][currentindex] === "1") {
        validatednumbers.push(inputnumbers[j]);
      }
    }
  }
  return validatednumbers;
};

const findCO2Generator = function (file: string): string {
  const startingNumbers = prepFile(file);
  let currentIndex = 0;
  let validatedNumbers = reduceForCO2(startingNumbers, currentIndex);
  while (validatedNumbers.length > 1) {
    currentIndex++;
    validatedNumbers = reduceForCO2(validatedNumbers, currentIndex);
  }
  return validatedNumbers[0];
};

const calculateLifeSupportRating = function (file: string) {
  const oxygenBinary = findOxygenGenerator(file);
  const CO2Binary = findCO2Generator(file);
  const oxygenDecimal = parseInt(oxygenBinary, 2);
  const CO2Decimal = parseInt(CO2Binary, 2);
  return oxygenDecimal * CO2Decimal;
};

console.log(calculateLifeSupportRating("input.txt"));
