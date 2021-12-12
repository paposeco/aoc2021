const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

//part 1

const mirror = function (char: string): string {
  let mirroredchar: string = "";
  switch (char) {
    case "]":
      mirroredchar = "[";
      break;
    case ")":
      mirroredchar = "(";
      break;
    case "}":
      mirroredchar = "{";
      break;
    case ">":
      mirroredchar = "<";
      break;
    case "[":
      mirroredchar = "]";
      break;
    case "(":
      mirroredchar = ")";
      break;
    case "{":
      mirroredchar = "}";
      break;
    case "<":
      mirroredchar = ">";
      break;
  }
  return mirroredchar;
};

const findSingleIllegalChar = function (line: string): string | undefined {
  let linearray = Array.from(line);
  let closearray: number[] = [];
  for (let i = 0; i < linearray.length; i++) {
    if (
      linearray[i] === "]" ||
      linearray[i] === ")" ||
      linearray[i] === ">" ||
      linearray[i] === "}"
    ) {
      closearray.push(i);
    }
  }
  let openFound: boolean = false;
  while (!openFound) {
    const char = linearray[closearray[0]];
    const mirroredchar = mirror(char);
    const open = linearray[closearray[0] - 1];
    if (open !== mirroredchar) {
      openFound = true;
      return char;
    } else {
      linearray.splice(closearray[0] - 1, 2);
      closearray.shift();
      const newclosearray = closearray.map((element) => element - 2);
      closearray = newclosearray;
    }
  }
};

const findIllegalChars = function (file: string) {
  const input = prepFile(file);
  let illegalchars: string[] = [];
  let incompletelines: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const char: string | undefined = findSingleIllegalChar(input[i]);
    if (char !== undefined) {
      illegalchars.push(char);
    } else {
      incompletelines.push(input[i]);
    }
  }
  return illegalchars;
};

const calculatePoints = function (file: string) {
  const illegalchars = findIllegalChars(file);
  let numberRound = 0;
  let numberSquare = 0;
  let numberCurly = 0;
  let numberLess = 0;
  illegalchars.forEach(function (element) {
    if (element === ")") {
      numberRound += 1;
    } else if (element === "]") {
      numberSquare += 1;
    } else if (element === "}") {
      numberCurly += 1;
    } else {
      numberLess += 1;
    }
  });
  return (
    3 * numberRound +
    57 * numberSquare +
    1197 * numberCurly +
    25137 * numberLess
  );
};

//part 2

const findIncompleteLines = function (file: string) {
  const input = prepFile(file);
  let illegalchars: string[] = [];
  let incompletelines: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const char: string | undefined = findSingleIllegalChar(input[i]);
    if (char !== undefined) {
      illegalchars.push(char);
    } else {
      incompletelines.push(input[i]);
    }
  }
  return incompletelines;
};

const completeSingleLine = function (line: string) {
  let linearray = Array.from(line);
  let closearray: number[] = [];
  for (let i = 0; i < linearray.length; i++) {
    if (
      linearray[i] === "]" ||
      linearray[i] === ")" ||
      linearray[i] === ">" ||
      linearray[i] === "}"
    ) {
      closearray.push(i);
    }
  }

  while (closearray.length > 0) {
    linearray.splice(closearray[0] - 1, 2);
    closearray.shift();
    const newclosearray = closearray.map((element) => element - 2);
    closearray = newclosearray;
  }
  return linearray;
};

const calculateClosePoints = function (line: string[]) {
  let sum = 0;
  for (let i = line.length - 1; i >= 0; i--) {
    const mirroredchar = mirror(line[i]);
    let currentPointValue = 0;
    if (mirroredchar === ")") {
      currentPointValue = 1;
    } else if (mirroredchar === "]") {
      currentPointValue = 2;
    } else if (mirroredchar === "}") {
      currentPointValue = 3;
    } else {
      currentPointValue = 4;
    }
    sum = sum * 5 + currentPointValue;
  }
  return sum;
};

const completeLinesAndCount = function (file: string) {
  const input = findIncompleteLines(file);
  let pointsArray: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const charsIncomplete = completeSingleLine(input[i]);
    const sum = calculateClosePoints(charsIncomplete);
    pointsArray.push(sum);
  }
  return pointsArray;
};

const findMiddleScore = function (file: string) {
  const completelines = completeLinesAndCount(file);
  const sorted = completelines.sort(sorter);
  const middleArray: number = (sorted.length - 1) / 2;
  return sorted[middleArray];
};

const sorter = function (a: number, b: number) {
  return a - b;
};

console.log(findMiddleScore("input.txt"));
