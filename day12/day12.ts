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
        if (connection !== "end") {
          if (locationsMap.has(connection)) {
            let currentLocationOnMap = locationsMap.get(connection);
            if (currentLocationOnMap !== undefined) {
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
        }
      });
    }
  }

  return locationsMap;
};

const createPaths = function (file: string) {
  const allConnections: Map<string, NodeType> = createNodeConnections(file);
  const startNode = allConnections.get("start");
  console.log(allConnections);
  if (startNode !== undefined) {
    let listOfPaths: string[][] = [];
    for (let i = 0; i < startNode.adjacentNodes.length; i++) {
      const currentNode = startNode.adjacentNodes[i];
      let path = ["start", currentNode];
      listOfPaths.concat(
        createPathFromStart(listOfPaths, path, allConnections, currentNode)
      );
    }
    console.log(listOfPaths);
  }
};

const createPathFromStart = function (
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
        if (!nodeInMap.bigcave || currentAdjacentNode === "end") {
          continue;
        }
      }
      copyPath.push(currentAdjacentNode);
      listOfPaths.push(copyPath);
      return createPathFromStart(
        listOfPaths,
        copyPath,
        allConnections,
        currentAdjacentNode
      );
    }
  }
  return listOfPaths;
};

createPaths("inputmini.txt");
