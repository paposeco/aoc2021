const prepFile = function (file: string): [string, Map<string, string>] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  const startingPoint: string = input[0];
  let insertionRules: Map<string, string> = new Map();
  for (let i = 2; i < input.length; i++) {
    const splitRule = input[i].split("->");
    insertionRules.set(splitRule[0].trim(), splitRule[1].trim());
  }
  return [startingPoint, insertionRules];
};

const applyRules = function (
  startingPoint: string,
  rules: Map<string, string>
) {
  let finalString: string = "";
  for (let i = 0; i < startingPoint.length - 1; i++) {
    const pair = startingPoint.substring(i, i + 2);
    if (i === 0) {
      finalString += pair[0];
    }
    const rule = rules.get(pair);
    if (rule !== undefined) {
      finalString += rule;
    }
    finalString += pair[1];
  }
  return finalString;
};

const runSteps = function (file: string): string {
  const input = prepFile(file);
  let startingPoint = input[0];
  const rules = input[1];

  let steps = 0;
  while (steps < 10) {
    startingPoint = applyRules(startingPoint, rules);
    steps += 1;
  }
  return startingPoint;
};

const countPoints = function (file: string) {
  const letterMap: Map<string, number> = new Map();
  const finalString = runSteps(file);
  for (let i = 0; i < finalString.length; i++) {
    const letter = finalString[i];
    if (letterMap.has(letter)) {
      const mapEntry = letterMap.get(letter);
      if (mapEntry !== undefined) {
        letterMap.set(letter, mapEntry + 1);
      }
    } else {
      letterMap.set(letter, 1);
    }
  }
  let leastCommon = 0;
  let mostCommon = 0;
  for (const [key, value] of letterMap) {
    if (leastCommon === 0) {
      leastCommon = value;
    } else if (leastCommon > value) {
      leastCommon = value;
    }
    if (mostCommon === 0) {
      mostCommon = value;
    } else if (mostCommon < value) {
      mostCommon = value;
    }
  }
  return mostCommon - leastCommon;
};

const applyRulesSingle = function (
  startingPoint: string,
  rules: Map<string, string>
) {
  let finalString: string = "";
  for (let i = 0; i < startingPoint.length - 1; i++) {
    const pair = startingPoint.substring(i, i + 2);
    if (i === 0) {
      finalString += pair[0];
    }
    const rule = rules.get(pair);
    if (rule !== undefined) {
      finalString += rule;
    }
    finalString += pair[1];
  }

  return finalString;
};

const runStepsSingle = function (
  numberSteps: number,
  rules: Map<string, string>,
  pair: string,
  firstPair: boolean
): string {
  let steps = 0;
  while (steps < numberSteps) {
    pair = applyRulesSingle(pair, rules);
    steps += 1;
  }
  if (!firstPair) {
    pair = pair.substring(1);
  }
  return pair;
};

const runStepsTotal = function (file: string, numberSteps: number) {
  const input = prepFile(file);
  const rules = input[1];
  const entireString = input[0];
  let pairs: string[] = [];
  for (let i = 0; i < entireString.length - 1; i++) {
    const pair = entireString.substring(i, i + 2);
    pairs.push(pair);
  }
  for (let j = 0; j < pairs.length; j++) {
    const currentPair = pairs[j];
    let resultingString: string = "";
    if (j === 0) {
      resultingString = runStepsSingle(numberSteps, rules, currentPair, true);
    } else {
      resultingString = runStepsSingle(numberSteps, rules, currentPair, false);
    }
    console.log(resultingString);
  }
  //return letterMap;
};

// const countPointsFromMap = function (file: string, numberSteps: number) {
//   const letterMap = runStepsTotal(file, numberSteps);
//   let leastCommon = 0;
//   let mostCommon = 0;
//   for (const [key, value] of letterMap) {
//     if (leastCommon === 0) {
//       leastCommon = value;
//     } else if (leastCommon > value) {
//       leastCommon = value;
//     }
//     if (mostCommon === 0) {
//       mostCommon = value;
//     } else if (mostCommon < value) {
//       mostCommon = value;
//     }
//   }
//   return mostCommon - leastCommon;
// };

console.log(runStepsTotal("inputmini.txt", 8));

// const applyRulesSingle = function (
//   startingPoint: string,
//   rules: Map<string, string>
// ) {
//   let finalString: string = "";
//   for (let i = 0; i < startingPoint.length - 1; i++) {
//     const pair = startingPoint.substring(i, i + 2);
//     if (i === 0) {
//       finalString += pair[0];
//     }
//     const rule = rules.get(pair);
//     if (rule !== undefined) {
//       finalString += rule;
//     }
//     finalString += pair[1];
//   }

//   return finalString;
// };

// const runStepsSingle = function (
//   numberSteps: number,
//   rules: Map<string, string>,
//   pair: string,
//   letterMap: Map<string, number>,
//   firstPair: boolean
// ): Map<string, number> {
//   let steps = 0;
//   while (steps < numberSteps) {
//     pair = applyRulesSingle(pair, rules);
//     steps += 1;
//   }
//   if (!firstPair) {
//     pair = pair.substring(1);
//   }
//   for (let i = 0; i < pair.length; i++) {
//     const letter = pair[i];
//     if (letterMap.has(letter)) {
//       const mapEntry = letterMap.get(letter);
//       if (mapEntry !== undefined) {
//         letterMap.set(letter, mapEntry + 1);
//       }
//     } else {
//       letterMap.set(letter, 1);
//     }
//   }
//   return letterMap;
// };

// const runStepsTotal = function (file: string, numberSteps: number) {
//   const input = prepFile(file);
//   const rules = input[1];
//   const entireString = input[0];
//   let pairs: string[] = [];
//   for (let i = 0; i < entireString.length - 1; i++) {
//     const pair = entireString.substring(i, i + 2);
//     pairs.push(pair);
//   }
//   let letterMap: Map<string, number> = new Map();
//   for (let j = 0; j < pairs.length; j++) {
//     const currentPair = pairs[j];
//     if (j === 0) {
//       runStepsSingle(numberSteps, rules, currentPair, letterMap, true);
//     } else {
//       runStepsSingle(numberSteps, rules, currentPair, letterMap, false);
//     }
//   }
//   return letterMap;
// };

// const countPointsFromMap = function (file: string, numberSteps: number) {
//   const letterMap = runStepsTotal(file, numberSteps);
//   let leastCommon = 0;
//   let mostCommon = 0;
//   for (const [key, value] of letterMap) {
//     if (leastCommon === 0) {
//       leastCommon = value;
//     } else if (leastCommon > value) {
//       leastCommon = value;
//     }
//     if (mostCommon === 0) {
//       mostCommon = value;
//     } else if (mostCommon < value) {
//       mostCommon = value;
//     }
//   }
//   return mostCommon - leastCommon;
// };
