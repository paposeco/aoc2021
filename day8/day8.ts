const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

//part 1
const countOutputValues = function (file: string) {
  const input = prepFile(file);
  let uniqueNumbers = 0;
  for (let i = 0; i < input.length; i++) {
    const outputvalue = input[i].split(" | ")[1];
    const splitOutput = outputvalue.split(" ");
    splitOutput.forEach(function (word) {
      if (
        word.length === 2 ||
        word.length === 4 ||
        word.length === 3 ||
        word.length === 7
      ) {
        uniqueNumbers += 1;
      }
    });
  }
  return uniqueNumbers;
};

interface NumberLocation {
  [key: string]: number;
}

// part 2
const identifyLettersInEachLocation = function (file: string) {
  const input = prepFile(file);
  let sumValues = 0;
  for (let i = 0; i < input.length; i++) {
    const outputvalue = input[i].split(" | ")[0];
    const splitOutput = outputvalue.split(" ");
    // it's repetitive to keep both dictionaries, but I started with the first one and realized that the second one would be very useful later on, so here we are
    let letterLocation = {
      l0: "x",
      l1: "x",
      l2: "x",
      l3: "x",
      l4: "x",
      l5: "x",
      l6: "x",
    };
    let numberLocation: NumberLocation = {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
      e: -1,
      f: -1,
      g: -1,
    };
    let sevenInOutput = splitOutput.find((element) => element.length === 3);
    let oneInOutput = splitOutput.find((element) => element.length === 2);
    if (sevenInOutput !== undefined && oneInOutput !== undefined) {
      let seven = Array.from(sevenInOutput).sort().join("");
      let one = Array.from(oneInOutput).sort().join("");
      if (seven[0] !== one[0]) {
        letterLocation.l0 = seven[0];
        letterLocation.l1 = seven[1];
        letterLocation.l2 = seven[2];
        numberLocation[seven[0]] = 0;
        numberLocation[seven[1]] = 1;
        numberLocation[seven[2]] = 2;
      } else if (seven[1] !== one[1]) {
        letterLocation.l0 = seven[1];
        letterLocation.l1 = seven[0];
        letterLocation.l2 = seven[2];
        numberLocation[seven[1]] = 0;
        numberLocation[seven[0]] = 1;
        numberLocation[seven[2]] = 2;
      } else {
        letterLocation.l0 = seven[2];
        letterLocation.l1 = seven[0];
        letterLocation.l2 = seven[1];
        numberLocation[seven[2]] = 0;
        numberLocation[seven[0]] = 1;
        numberLocation[seven[1]] = 2;
      }
    }
    let threeInOutput = splitOutput.find(
      (element) =>
        element.length === 5 &&
        element.includes(letterLocation.l0) &&
        element.includes(letterLocation.l1) &&
        element.includes(letterLocation.l2)
    );
    let fourInOutput = splitOutput.find((element) => element.length === 4);
    if (threeInOutput !== undefined) {
      let threeWithoutL0L1L2 = threeInOutput
        .replace(letterLocation.l0, "")
        .replace(letterLocation.l1, "")
        .replace(letterLocation.l2, "");
      letterLocation.l3 = threeWithoutL0L1L2[0];
      letterLocation.l6 = threeWithoutL0L1L2[1];
      numberLocation[threeWithoutL0L1L2[0]] = 3;
      numberLocation[threeWithoutL0L1L2[1]] = 6;

      if (fourInOutput !== undefined) {
        let fourWithoutL1L2 = fourInOutput
          .replace(letterLocation.l1, "")
          .replace(letterLocation.l2, "");
        if (
          fourWithoutL1L2[0] !== letterLocation.l3 &&
          fourWithoutL1L2[0] !== letterLocation.l6
        ) {
          letterLocation.l5 = fourWithoutL1L2[0];
          letterLocation.l6 = fourWithoutL1L2[1];
          numberLocation[fourWithoutL1L2[0]] = 5;
          numberLocation[fourWithoutL1L2[1]] = 6;
        } else {
          letterLocation.l5 = fourWithoutL1L2[1];
          letterLocation.l6 = fourWithoutL1L2[0];
          numberLocation[fourWithoutL1L2[1]] = 5;
          numberLocation[fourWithoutL1L2[0]] = 6;
        }
        let threeWithoutL0L1L2L6 = threeWithoutL0L1L2.replace(
          letterLocation.l6,
          ""
        );
        letterLocation.l3 = threeWithoutL0L1L2L6;
        numberLocation[threeWithoutL0L1L2L6] = 3;
      }
      let eightInOutput = splitOutput.find((element) => element.length === 7);
      if (eightInOutput !== undefined) {
        let eightInOutputWithoutEverythingExpectL4 = eightInOutput
          .replace(letterLocation.l0, "")
          .replace(letterLocation.l1, "")
          .replace(letterLocation.l2, "")
          .replace(letterLocation.l3, "")
          .replace(letterLocation.l5, "")
          .replace(letterLocation.l6, "");
        letterLocation.l4 = eightInOutputWithoutEverythingExpectL4;
        numberLocation[eightInOutputWithoutEverythingExpectL4] = 4;
      }
      let fiveInOutput = splitOutput.find(
        (element) =>
          element.length === 5 &&
          element.includes(letterLocation.l0) &&
          element.includes(letterLocation.l5) &&
          element.includes(letterLocation.l6) &&
          element.includes(letterLocation.l3)
      );
      if (fiveInOutput !== undefined) {
        let fiveWithoutL0L5L6L3 = fiveInOutput
          .replace(letterLocation.l0, "")
          .replace(letterLocation.l5, "")
          .replace(letterLocation.l6, "")
          .replace(letterLocation.l3, "");
        letterLocation.l2 = fiveWithoutL0L5L6L3;
        numberLocation[fiveWithoutL0L5L6L3] = 2;
      }
    }
    let oneAgain = splitOutput.find((element) => element.length === 2);
    if (oneAgain !== undefined) {
      let oneWithoutL2 = oneAgain.replace(letterLocation.l2, "");
      letterLocation.l1 = oneWithoutL2;
      numberLocation[oneWithoutL2] = 1;
    }
    const outputValue = Number(
      decodeOutput(input[i].split(" | ")[1], numberLocation)
    );
    sumValues += outputValue;
  }
  return sumValues;
};

const decodeOutput = function (
  currentstring: string,
  locations: NumberLocation
) {
  const splitString = currentstring.split(" ");
  let digits = "";
  for (let i = 0; i < splitString.length; i++) {
    const currentnumber = splitString[i];
    let locationsarray: number[] = [];
    for (let j = 0; j < currentnumber.length; j++) {
      const currentletter = currentnumber[j];
      locationsarray.push(locations[currentletter]);
    }
    digits += getDigitFromLocations(locationsarray);
  }
  return digits;
};

const getDigitFromLocations = function (locationsarray: number[]) {
  const length = locationsarray.length;
  let digit: number = -1;
  switch (length) {
    case 2: {
      digit = 1;
      break;
    }
    case 3: {
      digit = 7;
      break;
    }
    case 4: {
      digit = 4;
      break;
    }
    case 7: {
      digit = 8;
      break;
    }
    case 5: {
      const sum = locationsarray.reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue,
        0
      );
      if (sum === 14) {
        digit = 2;
        break;
      } else if (sum === 12) {
        digit = 3;
        break;
      } else {
        digit = 5;
        break;
      }
    }
    case 6: {
      const sum = locationsarray.reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue,
        0
      );
      if (sum === 15) {
        digit = 0;
        break;
      } else if (sum === 20) {
        digit = 6;
        break;
      } else {
        digit = 9;
        break;
      }
    }
  }
  return digit;
};

identifyLettersInEachLocation("input.txt");
