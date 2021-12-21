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

//part 2

const countLetters = function (
  file: string,
  steps: number
): Map<string, number> {
  const input = prepFile(file);
  const rules = input[1];
  const startingString = input[0];
  let internalSteps = 0;
  let startingPairs: string[] = [];
  let pairMap: Map<string, number> = new Map();
  let letterMap: Map<string, number> = new Map();
  for (let i = 0; i < startingString.length - 1; i++) {
    if (letterMap.has(startingString[i])) {
      const currentCount = letterMap.get(startingString[i]);
      if (currentCount !== undefined) {
        letterMap.set(startingString[i], currentCount + 1);
      }
    } else {
      letterMap.set(startingString[i], 1);
    }
    if (i === startingString.length - 2) {
      if (letterMap.has(startingString[i + 1])) {
        const currentCount = letterMap.get(startingString[i + 1]);
        if (currentCount !== undefined) {
          letterMap.set(startingString[i + 1], currentCount + 1);
        }
      } else {
        letterMap.set(startingString[i + 1], 1);
      }
    }
    const pair = startingString.substring(i, i + 2);
    startingPairs.push(pair);
    if (pairMap.has(pair)) {
      const value = pairMap.get(pair);
      if (value !== undefined) {
        pairMap.set(pair, value + 1);
      }
    } else {
      pairMap.set(pair, 1);
    }
  }

  while (internalSteps < steps) {
    let copyMap: Map<string, number> = new Map();
    for (const [key, value] of pairMap) {
      copyMap.set(key, value);
    }
    for (const [key, value] of copyMap) {
      if (value === 0) {
        continue;
      }

      const letterToAdd = rules.get(key);

      if (letterToAdd !== undefined) {
        const pairCountOnCopyMap = copyMap.get(key);
        const pairCountOnPairMap = pairMap.get(key);
        const leftPair = key[0] + letterToAdd;
        const rightPair = letterToAdd + key[1];
        // update old pair that disappeared
        if (
          pairCountOnCopyMap !== undefined &&
          pairMap.has(key) &&
          pairCountOnPairMap !== undefined
        ) {
          pairMap.set(key, pairCountOnPairMap - pairCountOnCopyMap);
        } else {
          if (pairCountOnCopyMap !== undefined) {
            pairMap.set(key, 0);
          }
        }
        // update new pairs
        if (pairMap.has(leftPair)) {
          const currentLeftPairCount = pairMap.get(leftPair);
          if (
            currentLeftPairCount !== undefined &&
            pairCountOnCopyMap !== undefined
          ) {
            pairMap.set(leftPair, currentLeftPairCount + pairCountOnCopyMap);
          }
        } else {
          if (pairCountOnCopyMap !== undefined) {
            pairMap.set(leftPair, pairCountOnCopyMap);
          }
        }
        if (pairMap.has(rightPair)) {
          const currentRightPairCount = pairMap.get(rightPair);
          if (
            currentRightPairCount !== undefined &&
            pairCountOnCopyMap !== undefined
          ) {
            pairMap.set(rightPair, currentRightPairCount + pairCountOnCopyMap);
          }
        } else {
          if (pairCountOnCopyMap !== undefined) {
            pairMap.set(rightPair, pairCountOnCopyMap);
          }
        }
        //update letter count
        if (pairCountOnCopyMap !== undefined) {
          if (letterMap.has(letterToAdd)) {
            const currentLetterCount = letterMap.get(letterToAdd);
            if (currentLetterCount !== undefined) {
              letterMap.set(
                letterToAdd,
                currentLetterCount + pairCountOnCopyMap
              );
            }
          } else {
            letterMap.set(letterToAdd, pairCountOnCopyMap);
          }
        }
      }
    }
    internalSteps += 1;
  }

  return letterMap;
};

const countPointsFromMap = function (file: string, steps: number) {
  const letterMap = countLetters(file, steps);
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

console.log(countPointsFromMap("input.txt", 40));
