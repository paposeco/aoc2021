const prepFile = function (file: string): [number[][], Folds[]] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();

  const indexEmptyString = input.findIndex((element) => element === "");
  const dots = input.slice(0, indexEmptyString);
  const dotsToString = dots.map((element) => element.split(","));
  let dotsToNumber: number[][] = [];
  for (let i = 0; i < dotsToString.length; i++) {
    dotsToNumber.push([Number(dotsToString[i][0]), Number(dotsToString[i][1])]);
  }
  let folds = input.slice(indexEmptyString + 1);
  let foldsToNumber: Folds[] = [];
  for (let j = 0; j < folds.length; j++) {
    const currentfold: Folds = {
      direction: folds[j][11],
      location: Number(folds[j].substring(13)),
    };
    foldsToNumber.push(currentfold);
  }
  return [dotsToNumber, foldsToNumber];
};

interface Folds {
  direction: string;
  location: number;
}

const foldPaper = function (file: string) {
  const prepfile = prepFile(file);
  let dots = prepfile[0];
  const folds = prepfile[1];
  for (let i = 0; i < folds.length; i++) {
    const direction = folds[i].direction;
    const foldline = folds[i].location;
    for (let j = 0; j < dots.length; j++) {
      let dotX = dots[j][0];
      let dotY = dots[j][1];
      if (direction === "x") {
        // left
        if (dotX > foldline) {
          const distanceFromLine = dotX - foldline;
          const mirroredDotX = foldline - distanceFromLine;
          dots[j][0] = mirroredDotX;
        }
      } else {
        // up
        if (dotY > foldline) {
          const distanceFromLine = dotY - foldline;
          const mirroredDotY = foldline - distanceFromLine;
          dots[j][1] = mirroredDotY;
        }
      }
    }
  }
  const dotsMap: Map<string, number> = new Map();
  dots.forEach(function (element) {
    const toString = element.toString();
    if (!dotsMap.has(toString)) {
      dotsMap.set(toString, 1);
    }
  });
  return dotsMap;
};

// part 2
const drawLetters = function (file: string) {
  const foldpaper = foldPaper(file);
  let maxX: number = 0;
  let maxY: number = 0;
  for (const [key, value] of foldpaper) {
    const splitKey = key.split(",");
    const splitKeyX = Number(splitKey[0]);
    const splitKeyY = Number(splitKey[1]);
    if (maxX < splitKeyX) {
      maxX = splitKeyX;
    }
    if (maxY < splitKeyY) {
      maxY = splitKeyY;
    }
  }
  for (let i = 0; i <= maxY; i++) {
    let row = [];
    for (let j = 0; j <= maxX; j++) {
      const locationString = `${j},${i}`;
      if (foldpaper.has(locationString)) {
        row.push("#");
      } else {
        row.push(".");
      }
    }
    console.log(row.toString());
  }
};

drawLetters("input.txt");
