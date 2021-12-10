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
              console.log(uprow[j - 1], upnumber, uprow[j + 1]);
              console.log(leftnumber, currentnumber, rightnumber);
              console.log(downrow[j - 1], downnumber, downrow[j + 1]);
              console.log("****");
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

const checkBasin = function (file: string) {
  let lowpoints = findLowPoints(file);
  let input = prepFile(file);
  const maxI = Number(input.length - 1);
  const maxJ = Number(input[0].length - 1);
  let basins: number[] = [];
  for (let k = 0; k < lowpoints.length; k++) {
    const currentlowpointI = Number(lowpoints[k].i);
    const currentlowpointJ = Number(lowpoints[k].j);
  }
};

//findLowPoints("input.txt");

//middle basin

const inputteste = prepFile("inputmini.txt");
const checkedLocations = new Map();
const checkSingleBasin = function (
  startingI: number,
  startingJ: number,
  input: string[],
  checkedLocations: Map<string, number | boolean>
): Map<string, number | boolean> {
  let basins = 0;
  const middlenumber = Number(input[startingI][startingJ]);
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
  console.log(" ", north);
  console.log(west, middlenumber, east);
  console.log(" ", south);
  checkedLocations.set(`${startingI},${startingJ}`, true);
  if (north !== -1 && north !== 9) {
    checkedLocations.set(`${startingI - 1},${startingJ}`, north);
  }
  if (south !== -1 && south !== 9) {
    checkedLocations.set(`${startingI + 1},${startingJ}`, south);
  }
  if (east !== -1 && east !== 9) {
    checkedLocations.set(`${startingI},${startingJ + 1}`, east);
  }
  if (west !== -1 && west !== 9) {
    checkedLocations.set(`${startingI},${startingJ - 1}`, west);
  }
  basins += 1; //middlenumber | maybe I can just count trues
  //console.log(checkedLocations); // => new locations to check

  for (const [key, value] of checkedLocations) {
    if (value === 8) {
      checkedLocations.set(key, true);
      continue;
    }
    if (value !== true) {
      const newcoord = key.split(",");
      const newi = Number(newcoord[0]);
      const newj = Number(newcoord[1]);
      return checkSingleBasin(newi, newj, input, checkedLocations);
    }
  }
  return checkedLocations;
};

// tenho d pensar quando é que para e que na segunda verificacao, tem de ver se o north, south etc é true

checkSingleBasin(2, 2, inputteste, checkedLocations);

// if number checked is east => check north, east, south
// if number checked is south => check east, west, south
// if number checked is north => check north, east, west
// if number checked is west => check west, north, south
