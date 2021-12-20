const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

interface NodeInfo {
  adjacentNodes: string[];
  visited: boolean;
  visiteonce: boolean;
}

const countPaths = function (file: string) {
  const locations = storeLocations(file);
  const startingpoint = locations.get("start");
  if (startingpoint !== undefined) {
    let startingpointAdjacents = startingpoint.adjacentNodes;
    let numberpoints = startingpointAdjacents.length;
    let currentpath: string[] = ["start"];
    for (let i = 0; i < startingpointAdjacents.length; i++) {
      const nextPoint = startingpointAdjacents[i];
      currentpath.push(nextPoint);
    }
  }
};

interface NodeType {
  adjacentNodes: string[];
  bigcave: boolean;
}

const storeLocations = function (file: string): Map<string, NodeType> {
  const input = prepFile(file);
  let locations: Map<string, NodeType> = new Map();
  for (let i = 0; i < input.length; i++) {
    const path = input[i].split("-");
    const pathfrom = path[0];
    let upperOrLowerCase = false;
    if (pathfrom.toUpperCase() === pathfrom) {
      upperOrLowerCase = true;
    }
    const pathto = path[1];
    if (locations.has(pathfrom)) {
      let pathToStored = locations.get(pathfrom);
      if (pathToStored !== undefined) {
        const updatePathTo = Object.assign({}, pathToStored);
        updatePathTo.adjacentNodes.push(pathto);
        locations.set(pathfrom, updatePathTo);
      }
    } else {
      locations.set(pathfrom, {
        adjacentNodes: [pathto],
        bigcave: upperOrLowerCase,
      });
    }
  }
  return locations;
};

const createNodeConnections = function (file: string): Map<string, NodeType> {
  const locationsMap = storeLocations(file);
  for (const [key, value] of locationsMap) {
    if (key.toUpperCase() === key) {
      const directNodeConnections = value.adjacentNodes;
      directNodeConnections.forEach((connection) => {
        if (locationsMap.has(connection)) {
          let currentLocationOnMap = locationsMap.get(connection);
          if (
            currentLocationOnMap !== undefined &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          }
        } else {
          let upperOrLowerCase = false;
          if (connection.toUpperCase() === connection) {
            upperOrLowerCase = true;
          }
          locationsMap.set(connection, {
            adjacentNodes: [key],
            bigcave: upperOrLowerCase,
          });
        }
      });
    } else {
      const directNodeConnections = value.adjacentNodes;
      directNodeConnections.forEach((connection) => {
        if (locationsMap.has(connection)) {
          let currentLocationOnMap = locationsMap.get(connection);
          if (
            currentLocationOnMap !== undefined &&
            key !== "start" &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          } else if (
            currentLocationOnMap !== undefined &&
            key !== "end" &&
            connection === "start" &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          }
        } else {
          let upperOrLowerCase = false;
          if (connection.toUpperCase() === connection) {
            upperOrLowerCase = true;
          }
          locationsMap.set(connection, {
            adjacentNodes: [key],
            bigcave: upperOrLowerCase,
          });
        }
      });
    }
  }
  return locationsMap;
};

//createNodeConnections("inputmini3.txt");

const createPaths = function (file: string) {
  const allConnections: Map<string, NodeType> = createNodeConnections(file);
  const startNode = allConnections.get("start");
  if (startNode !== undefined) {
    let listOfPaths: string[][] = [];
    for (let i = 0; i < startNode.adjacentNodes.length; i++) {
      const currentNode = startNode.adjacentNodes[i];
      let path = ["start", currentNode];
      listOfPaths.concat(
        createPathAfterStart(listOfPaths, path, allConnections, currentNode)
      );
    }
    return listOfPaths;
  }
};

const createPathAfterStart = function (
  listOfPaths: string[][],
  path: string[],
  allConnections: Map<string, NodeType>,
  currentNode: string
): string[][] {
  const adjacentNodes = allConnections.get(currentNode);
  if (adjacentNodes !== undefined) {
    for (let i = 0; i < adjacentNodes.adjacentNodes.length; i++) {
      let copyPath = Array.from(path);
      const currentAdjacentNode = adjacentNodes.adjacentNodes[i];
      const nodeInMap = allConnections.get(currentAdjacentNode);
      if (nodeInMap !== undefined) {
        if (!nodeInMap.bigcave && copyPath.includes(currentAdjacentNode)) {
          continue;
        }
      }
      copyPath.push(currentAdjacentNode);
      listOfPaths.push(copyPath);
      listOfPaths = createPathAfterStart(
        listOfPaths,
        copyPath,
        allConnections,
        currentAdjacentNode
      );
    }
  }
  return listOfPaths;
};

const countValidPaths = function (file: string) {
  const allPaths = createPaths(file);
  if (allPaths !== undefined) {
    let validPaths: string[][] = [];
    for (let i = 0; i < allPaths.length; i++) {
      const currentPath = allPaths[i];
      if (currentPath[currentPath.length - 1] === "end") {
        validPaths.push(currentPath);
      }
    }
    console.log(validPaths.length);
  }
};

//part 2

interface NodeTypeTwice {
  adjacentNodes: string[];
  bigcave: boolean;
  visitTwice: boolean;
}

const storeLocationsPart2 = function (
  file: string
): Map<string, NodeTypeTwice> {
  const input = prepFile(file);
  let locations: Map<string, NodeTypeTwice> = new Map();
  for (let i = 0; i < input.length; i++) {
    const path = input[i].split("-");
    const pathfrom = path[0];
    let upperOrLowerCase = false;
    if (pathfrom.toUpperCase() === pathfrom) {
      upperOrLowerCase = true;
    }
    const pathto = path[1];
    if (locations.has(pathfrom)) {
      let pathToStored = locations.get(pathfrom);
      if (pathToStored !== undefined) {
        const updatePathTo = Object.assign({}, pathToStored);
        updatePathTo.adjacentNodes.push(pathto);
        locations.set(pathfrom, updatePathTo);
      }
    } else {
      locations.set(pathfrom, {
        adjacentNodes: [pathto],
        bigcave: upperOrLowerCase,
        visitTwice: false,
      });
    }
  }
  return locations;
};

const createNodeConnectionsPart2 = function (
  file: string
): Map<string, NodeTypeTwice> {
  const locationsMap = storeLocationsPart2(file);
  for (const [key, value] of locationsMap) {
    if (key.toUpperCase() === key) {
      const directNodeConnections = value.adjacentNodes;
      directNodeConnections.forEach((connection) => {
        if (locationsMap.has(connection)) {
          let currentLocationOnMap = locationsMap.get(connection);
          if (
            currentLocationOnMap !== undefined &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          }
        } else {
          let upperOrLowerCase = false;
          if (connection.toUpperCase() === connection) {
            upperOrLowerCase = true;
          }
          locationsMap.set(connection, {
            adjacentNodes: [key],
            bigcave: upperOrLowerCase,
            visitTwice: false,
          });
        }
      });
    } else {
      const directNodeConnections = value.adjacentNodes;
      directNodeConnections.forEach((connection) => {
        if (locationsMap.has(connection)) {
          let currentLocationOnMap = locationsMap.get(connection);
          if (
            currentLocationOnMap !== undefined &&
            key !== "start" &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          } else if (
            currentLocationOnMap !== undefined &&
            key !== "end" &&
            connection === "start" &&
            !currentLocationOnMap.adjacentNodes.includes(key)
          ) {
            currentLocationOnMap.adjacentNodes.push(key);
          }
        } else {
          let upperOrLowerCase = false;
          if (connection.toUpperCase() === connection) {
            upperOrLowerCase = true;
          }
          locationsMap.set(connection, {
            adjacentNodes: [key],
            bigcave: upperOrLowerCase,
            visitTwice: false,
          });
        }
      });
    }
  }
  return locationsMap;
};

const createPathsPart2 = function (file: string) {
  const allConnections: Map<string, NodeTypeTwice> =
    createNodeConnectionsPart2(file);
  const startNode = allConnections.get("start");
  let bigListOfPaths: string[][][] = [];
  if (startNode !== undefined) {
    for (const [key, value] of allConnections) {
      let listOfPaths: string[][] = [];
      const copyMap = new Map(allConnections);
      if (key.toUpperCase() !== key && key !== "start" && key !== "end") {
        const nodeToUpdate = copyMap.get(key);
        if (nodeToUpdate !== undefined) {
          let copyNode = Object.assign({}, nodeToUpdate);
          copyNode.visitTwice = true;
          copyMap.set(key, copyNode);
        }
      }
      for (let i = 0; i < startNode.adjacentNodes.length; i++) {
        const currentNode = startNode.adjacentNodes[i];
        let path = ["start", currentNode];
        let nodeValues = copyMap.get(currentNode);
        if (nodeValues !== undefined) {
          if (nodeValues.visitTwice) {
            let copyCurrentNode = Object.assign({}, nodeValues);
            copyMap.set(currentNode, copyCurrentNode);
          }
        }
        listOfPaths.concat(
          createPathAfterStartPart2(listOfPaths, path, copyMap, currentNode)
        );
      }
      bigListOfPaths.push(listOfPaths);
    }
    return bigListOfPaths.flat();
  }
};

const createPathAfterStartPart2 = function (
  listOfPaths: string[][],
  path: string[],
  allConnections: Map<string, NodeTypeTwice>,
  currentNode: string
): string[][] {
  const adjacentNodes = allConnections.get(currentNode);
  if (adjacentNodes !== undefined) {
    for (let i = 0; i < adjacentNodes.adjacentNodes.length; i++) {
      let copyPath = Array.from(path);
      if (copyPath[copyPath.length - 1] === "end") {
        continue;
      }
      const currentAdjacentNode = adjacentNodes.adjacentNodes[i];
      const nodeInMap = allConnections.get(currentAdjacentNode);
      if (nodeInMap !== undefined) {
        if (!nodeInMap.bigcave) {
          if (!nodeInMap.visitTwice && copyPath.includes(currentAdjacentNode)) {
            continue;
          } else if (nodeInMap.visitTwice) {
            let countOcurrencesOfNodeInPath = 0;
            copyPath.forEach((node) =>
              node === currentAdjacentNode
                ? (countOcurrencesOfNodeInPath += 1)
                : null
            );
            if (countOcurrencesOfNodeInPath > 1) {
              continue;
            }
          }
        }
      }
      copyPath.push(currentAdjacentNode);
      listOfPaths.push(copyPath);
      listOfPaths = createPathAfterStartPart2(
        listOfPaths,
        copyPath,
        allConnections,
        currentAdjacentNode
      );
    }
  }

  return listOfPaths;
};

const countValidPathsTwice = function (file: string) {
  const allPaths = createPathsPart2(file);
  if (allPaths !== undefined) {
    let uniquePaths: Map<string, number> = new Map();
    let uniquePathsCount = 0;
    for (let i = 0; i < allPaths.length; i++) {
      const currentPath = allPaths[i];
      if (currentPath[currentPath.length - 1] === "end") {
        if (!uniquePaths.has(currentPath.toString())) {
          const keyname = currentPath.toString();
          uniquePaths.set(keyname, 1);
          uniquePathsCount += 1;
        }
      }
    }
    console.log(uniquePathsCount);
    return uniquePathsCount;
  }
};

countValidPathsTwice("input.txt");
