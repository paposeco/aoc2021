const prepFile = function (file: string) {
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

console.log(findLowPoints("inputmini.txt"));
