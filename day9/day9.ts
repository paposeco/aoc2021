const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

interface LowPoint {
  i: number;
  j: number;
  lowpoint: number;
}

const findLowPoints = function (file: string) {
  const input = prepFile(file);
  let lowpoints: LowPoint[] = [];
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (i === 0) {
      const downrow = input[i + 1];
      for (let j = 0; j < row.length; j++) {
        const currentnumber = Number(row[j]);
        const downnumber = Number(downrow[j]);
        if (currentnumber < downnumber) {
          if (j === 0) {
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else if (j === row.length - 1) {
            const leftnumber = Number(row[j - 1]);
            if (currentnumber < leftnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else {
            const leftnumber = Number(row[j - 1]);
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < leftnumber && currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          }
        }
      }
    } else if (i === input.length - 1) {
      const uprow = input[i - 1];
      for (let j = 0; j < row.length; j++) {
        const currentnumber = Number(row[j]);
        const upnumber = Number(uprow[j]);
        if (currentnumber < upnumber) {
          if (j === 0) {
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else if (j === row.length - 1) {
            const leftnumber = Number(row[j - 1]);
            if (currentnumber < leftnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else {
            const leftnumber = Number(row[j - 1]);
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < leftnumber && currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          }
        }
      }
    } else {
      const uprow = input[i + 1];
      const downrow = input[i - 1];
      for (let j = 0; j < row.length; j++) {
        const currentnumber = Number(row[j]);
        const upnumber = Number(uprow[j]);
        const downnumber = Number(downrow[j]);
        if (currentnumber < upnumber && currentnumber < downnumber) {
          if (j === 0) {
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else if (j === row.length - 1) {
            const leftnumber = Number(row[j - 1]);
            if (currentnumber < leftnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          } else {
            const leftnumber = Number(row[j - 1]);
            const rightnumber = Number(row[j + 1]);
            if (currentnumber < leftnumber && currentnumber < rightnumber) {
              lowpoints.push({ i: i, j: j, lowpoint: currentnumber });
            }
          }
        }
      }
    }
  }
  return lowpoints;
};

const calculateRisk = function (file: string) {
  const findlowpoints = findLowPoints(file);
  const sum = findlowpoints.reduce(
    (previousValue, currentValue) => previousValue + 1 + currentValue.lowpoint,
    0
  );
  return sum;
};

const checkSingleBasin = function (
  startingI: number,
  startingJ: number,
  input: string[],
  checkedLocations: Map<string, number | boolean>,
  newlocations: number[][]
): Map<string, number | boolean> {
  const north =
    startingI - 1 < 0 ? -1 : Number(input[startingI - 1][startingJ]);
  const south =
    startingI + 1 > input.length - 1
      ? -1
      : Number(input[startingI + 1][startingJ]);
  const west = startingJ - 1 < 0 ? -1 : Number(input[startingI][startingJ - 1]);
  const east =
    startingJ + 1 > input[0].length - 1
      ? -1
      : Number(input[startingI][startingJ + 1]);
  // the middle number gets placed in the hash table because it belongs to the basin
  checkedLocations.set(`${startingI},${startingJ}`, true);

  if (north > 0 && !checkedLocations.has(`${startingI - 1},${startingJ}`)) {
    if (north === 9) {
      checkedLocations.set(`${startingI - 1},${startingJ}`, false);
    } else {
      newlocations.push([startingI - 1, startingJ]);
    }
  }

  if (south > 0 && !checkedLocations.has(`${startingI + 1},${startingJ}`)) {
    if (south === 9) {
      checkedLocations.set(`${startingI + 1},${startingJ}`, false);
    } else {
      newlocations.push([startingI + 1, startingJ]);
    }
  }
  if (east > 0 && !checkedLocations.has(`${startingI},${startingJ + 1}`)) {
    if (east === 9) {
      checkedLocations.set(`${startingI},${startingJ + 1}`, false);
    } else {
      newlocations.push([startingI, startingJ + 1]);
    }
  }
  if (west > 0 && !checkedLocations.has(`${startingI},${startingJ - 1}`)) {
    if (west === 9) {
      checkedLocations.set(`${startingI},${startingJ - 1}`, false);
    } else {
      newlocations.push([startingI, startingJ - 1]);
    }
  }

  for (let i = 0; i < newlocations.length; i++) {
    const newstartingI = newlocations[i][0];
    const newstartingJ = newlocations[i][1];
    let newlocationstocheck: number[][] = [];
    checkSingleBasin(
      newstartingI,
      newstartingJ,
      input,
      checkedLocations,
      newlocationstocheck
    );
  }
  return checkedLocations;
};

const countElementsInBasins = function (file: string): number {
  let lowpoints = findLowPoints(file);
  let input = prepFile(file);
  let basinsSizes: number[] = [];
  for (let k = 0; k < lowpoints.length; k++) {
    const middlenumberI = lowpoints[k].i;
    const middlenumberJ = lowpoints[k].j;
    let checkedLocations = new Map();
    let locationsToCheck: number[][] = [];
    checkSingleBasin(
      middlenumberI,
      middlenumberJ,
      input,
      checkedLocations,
      locationsToCheck
    );
    let basins = 0;
    for (const [key, value] of checkedLocations) {
      if (value === true) {
        basins += 1;
      }
    }
    basinsSizes.push(basins);
  }
  basinsSizes.sort(sorter);
  return basinsSizes[0] * basinsSizes[1] * basinsSizes[2];
};

const sorter = function (a: number, b: number): number {
  return b - a;
};

console.log(countElementsInBasins("input.txt"));
