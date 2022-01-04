const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  let inputToNumbers: number[][] = [];
  input.forEach((row) => {
    inputToNumbers.push(row.split("").map((element) => Number(element)));
  });
  return inputToNumbers;
};

const findAllPaths = function (
  file: string
): [number[][][], Map<string, number>, number[][]] {
  const cave = prepFile(file);
  let pathCollection: number[][][] = [[[0, 0]]];
  let riskLevels: Map<string, number> = new Map();
  let newpathcollectionlength = -1;
  while (newpathcollectionlength !== 0) {
    let newPathCollection: number[][][] = [];
    //cada instante pode ir para baixo ou para o lado
    //down
    for (let i = 0; i < pathCollection.length; i++) {
      let currentPathDown = Array.from(pathCollection[i]);
      const newPointDownX = currentPathDown[currentPathDown.length - 1][0];
      const newPointDownY = currentPathDown[currentPathDown.length - 1][1] + 1;
      if (
        newPointDownX > cave[0].length - 1 ||
        newPointDownY > cave.length - 1
      ) {
        continue;
      }
      const newPointDown = [
        currentPathDown[currentPathDown.length - 1][0],
        currentPathDown[currentPathDown.length - 1][1] + 1,
      ];
      if (!riskLevels.has(newPointDown.toString())) {
        const key = newPointDown.toString();
        const risklevel = cave[newPointDown[1]][newPointDown[0]];
        riskLevels.set(key, risklevel);
      }

      currentPathDown.push(newPointDown);
      newPathCollection.push(currentPathDown);
    }
    // console.log(newPathCollection);
    //right
    for (let j = 0; j < pathCollection.length; j++) {
      let currentPathRight = Array.from(pathCollection[j]);
      const newPointRightX =
        currentPathRight[currentPathRight.length - 1][0] + 1;
      const newPointRightY = currentPathRight[currentPathRight.length - 1][1];
      if (
        newPointRightX > cave[0].length - 1 ||
        newPointRightY > cave.length - 1
      ) {
        continue;
      }
      const newPointRight = [
        currentPathRight[currentPathRight.length - 1][0] + 1,
        currentPathRight[currentPathRight.length - 1][1],
      ];
      if (!riskLevels.has(newPointRight.toString())) {
        const key = newPointRight.toString();
        const risklevel = cave[newPointRight[1]][newPointRight[0]];
        riskLevels.set(key, risklevel);
      }
      currentPathRight.push(newPointRight);
      newPathCollection.push(currentPathRight);
    }
    //    console.log(newPathCollection);
    newpathcollectionlength = newPathCollection.length;
    // console.log(newpathcollectionlength);
    if (newpathcollectionlength !== 0) {
      pathCollection = newPathCollection;
    }
  }
  //console.log(pathCollection);
  return [pathCollection, riskLevels, cave];
};

const findBestPath = function (file: string) {
  const pathAndRiskLevels = findAllPaths(file);
  const allpaths = pathAndRiskLevels[0];
  const riskLevels = pathAndRiskLevels[1];
  const cave = pathAndRiskLevels[2];
  const endPointY = cave.length - 1;
  const endPointX = cave[0].length - 1;
  let lowestRiskPath = 0;
  for (let i = 0; i < allpaths.length; i++) {
    const currentPath = allpaths[i];
    //console.log(currentPath);
    // check for valid path
    const lastPointOnPath = currentPath[currentPath.length - 1];
    if (lastPointOnPath[0] !== endPointX || lastPointOnPath[1] !== endPointY) {
      continue;
    }
    const pathRiskLevel = calculateRiskLevelPath(currentPath, riskLevels);
    if (lowestRiskPath === 0) {
      lowestRiskPath = pathRiskLevel;
    } else if (lowestRiskPath > pathRiskLevel) {
      lowestRiskPath = pathRiskLevel;
    }
  }
  console.log(lowestRiskPath);
  return lowestRiskPath;
};

const calculateRiskLevelPath = function (
  path: number[][],
  risklevels: Map<string, number>
): number {
  let risklevel = path.reduce(function (previousValue, currentValue) {
    const currentRiskLevel = risklevels.get(currentValue.toString());
    let riskFromMap = 0;
    if (currentRiskLevel !== undefined) {
      riskFromMap = currentRiskLevel;
    }
    return previousValue + riskFromMap;
  }, 0);
  return risklevel;
};

const findBestPath2 = function (file: string) {
  const cave = prepFile(file);
  const maxX = cave[0].length - 1;
  const maxY = cave.length - 1;
  let startingpoint = [0, 0];
  let risklevel = continuePath(startingpoint, 0, maxX, maxY, cave);
  console.log(risklevel);
};

const continuePath = function (
  previousPoint: number[],
  risklevel: number,
  maxX: number,
  maxY: number,
  cave: number[][]
) {
  // check right and down
  let rightRisk = 0;
  let downRisk = 0;
  if (previousPoint[0] + 1 <= maxX) {
    const toTheRight = [previousPoint[0] + 1, previousPoint[1]];
    const riskOnRightPoint = cave[previousPoint[1]][previousPoint[0] + 1];
    rightRisk = continuePath(
      toTheRight,
      risklevel + riskOnRightPoint,
      maxX,
      maxY,
      cave
    );
  }
  if (previousPoint[1] + 1 <= maxY) {
    const down = [previousPoint[0], previousPoint[1] + 1];
    const riskOnLowerPoint = cave[previousPoint[1] + 1][previousPoint[0]];
    downRisk = continuePath(
      down,
      risklevel + riskOnLowerPoint,
      maxX,
      maxY,
      cave
    );
  }
  if (rightRisk === 0 && downRisk === 0) {
    return risklevel;
  }
  if (rightRisk === 0 && downRisk !== 0 && downRisk !== NaN) {
    return downRisk;
  }
  if (downRisk === 0 && rightRisk !== 0 && rightRisk !== NaN) {
    return rightRisk;
  }
  if (downRisk > rightRisk && rightRisk !== NaN) {
    return rightRisk;
  } else if (downRisk !== NaN) {
    return downRisk;
  } else {
    console.log("all nan");
    return 10000000000000000;
  }
};

findBestPath2("input.txt");
