const prepFile = function (file: string): number[][] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  let finalcoordinates: number[][] = [];
  input.forEach((row) => {
    const noarrow = row.split("->");
    let rowcoordinates: number[][] = [];
    noarrow.forEach((coord) => {
      const nocomma = coord.split(",");
      const tonumber = nocomma.map((element) => Number(element));
      rowcoordinates.push(tonumber);
    });
    const flat = rowcoordinates.flat();
    finalcoordinates.push(flat);
  });
  return finalcoordinates;
};

// part 1
const selectValidLines = function (file: string): number[][] {
  const coordinates = prepFile(file);
  const checkcoordinates = coordinates.filter(function (element) {
    if (element[0] === element[2] || element[1] === element[3]) {
      return true;
    } else {
      return false;
    }
  });
  return checkcoordinates;
};

interface FloorLocation {
  x: number;
  y: number;
  count: number;
}

const fillMap = function (file: string): FloorLocation[] {
  const validLines = selectValidLines(file);
  let locationsfilled: FloorLocation[] = [];
  for (let i = 0; i < validLines.length; i++) {
    const currentLine = validLines[i];
    const x1 = currentLine[0];
    const y1 = currentLine[1];
    const x2 = currentLine[2];
    const y2 = currentLine[3];
    if (x1 === x2) {
      let startingpoint: number = -1;
      let endpoint: number = -1;
      if (y1 < y2) {
        startingpoint = y1;
        endpoint = y2;
      } else {
        startingpoint = y2;
        endpoint = y1;
      }
      for (let j = startingpoint; j <= endpoint; j++) {
        const checkLocationExists = checkIfLocationAlreadyExists(
          x1,
          j,
          locationsfilled
        );
        if (checkLocationExists === -1) {
          let newlocation: FloorLocation = { x: x1, y: j, count: 1 };
          locationsfilled.push(newlocation);
        } else {
          locationsfilled[checkLocationExists].count += 1;
        }
      }
    } else {
      let startingpoint: number = -1;
      let endpoint: number = -1;
      if (x1 < x2) {
        startingpoint = x1;
        endpoint = x2;
      } else {
        startingpoint = x2;
        endpoint = x1;
      }
      for (let j = startingpoint; j <= endpoint; j++) {
        const checkLocationExists = checkIfLocationAlreadyExists(
          j,
          y1,
          locationsfilled
        );
        if (checkLocationExists === -1) {
          let newlocation: FloorLocation = { x: j, y: y1, count: 1 };
          locationsfilled.push(newlocation);
        } else {
          locationsfilled[checkLocationExists].count += 1;
        }
      }
    }
  }
  return locationsfilled;
};

const checkIfLocationAlreadyExists = function (
  x: number,
  y: number,
  collection: FloorLocation[]
) {
  const index = collection.findIndex((element) => {
    return element.x === x && element.y === y;
  });
  return index;
};

const countCounts = function (file: string): number {
  let total: number = 0;
  const filledmap: FloorLocation[] = fillMap(file);
  filledmap.forEach((location) => {
    if (location.count > 1) {
      ++total;
    }
  });
  return total;
};

// part 2

const fillMapDiagonal = function (file: string): FloorLocation[] {
  const input = prepFile(file);
  let locationsfilled: FloorLocation[] = [];
  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i];
    const x1 = currentLine[0];
    const y1 = currentLine[1];
    const x2 = currentLine[2];
    const y2 = currentLine[3];
    if (x1 === x2) {
      const yslope = y1 < y2 ? 1 : -1;
      const numberlocations = Math.abs(y1 - y2);
      for (let j = 0; j <= numberlocations; j++) {
        const checkLocationExists = checkIfLocationAlreadyExists(
          x1,
          y1 + j * yslope,
          locationsfilled
        );
        if (checkLocationExists === -1) {
          let newlocation: FloorLocation = {
            x: x1,
            y: y1 + j * yslope,
            count: 1,
          };
          locationsfilled.push(newlocation);
        } else {
          locationsfilled[checkLocationExists].count += 1;
        }
      }
    } else if (y1 === y2) {
      const xslope = x1 < x2 ? 1 : -1;
      const numberlocations = Math.abs(x1 - x2);
      for (let j = 0; j <= numberlocations; j++) {
        const checkLocationExists = checkIfLocationAlreadyExists(
          x1 + j * xslope,
          y1,
          locationsfilled
        );
        if (checkLocationExists === -1) {
          let newlocation: FloorLocation = {
            x: x1 + j * xslope,
            y: y1,
            count: 1,
          };
          locationsfilled.push(newlocation);
        } else {
          locationsfilled[checkLocationExists].count += 1;
        }
      }
    } else {
      const numberlocations = Math.abs(x1 - x2);
      const xslope = x1 < x2 ? 1 : -1;
      const yslope = y1 < y2 ? 1 : -1;
      for (let j = 0; j <= numberlocations; j++) {
        const checkLocationExists = checkIfLocationAlreadyExists(
          x1 + j * xslope,
          y1 + j * yslope,
          locationsfilled
        );
        if (checkLocationExists === -1) {
          let newlocation: FloorLocation = {
            x: x1 + j * xslope,
            y: y1 + j * yslope,
            count: 1,
          };
          locationsfilled.push(newlocation);
        } else {
          locationsfilled[checkLocationExists].count += 1;
        }
      }
    }
  }
  return locationsfilled;
};

const countCountsDiagonal = function (file: string): number {
  let total: number = 0;
  const filledmap: FloorLocation[] = fillMapDiagonal(file);
  filledmap.forEach((location) => {
    if (location.count > 1) {
      ++total;
    }
  });
  return total;
};

// part 2 with hash table
const fillMapDiagonalHashTable = function (file: string): Map<string, number> {
  const input: number[][] = prepFile(file);
  let locations = new Map<string, number>();
  for (let i = 0; i < input.length; i++) {
    const currentLine: number[] = input[i];
    const x1: number = currentLine[0];
    const y1: number = currentLine[1];
    const x2: number = currentLine[2];
    const y2: number = currentLine[3];
    if (x1 === x2) {
      const yslope: number = y1 < y2 ? 1 : -1;
      const numberlocations: number = Math.abs(y1 - y2);
      for (let j = 0; j <= numberlocations; j++) {
        const locationAlias: string = `x${x1}y${y1 + j * yslope}`;
        const checkLocationExists: boolean = locations.has(locationAlias);
        if (!checkLocationExists) {
          locations.set(locationAlias, 1);
        } else {
          
            const currentcount: number | undefined = locations.get(locationAlias);
            if(currentcount!==undefined){
                locations.set(locationAlias, currentcount + 1);                
            }

        }
      }
    } else if (y1 === y2) {
      const xslope: number = x1 < x2 ? 1 : -1;
      const numberlocations: number = Math.abs(x1 - x2);
      for (let j = 0; j <= numberlocations; j++) {
        const locationAlias: string = `x${x1 + j * xslope}y${y1}`;
        const checkLocationExists: boolean = locations.has(locationAlias);
        if (!checkLocationExists) {
          locations.set(locationAlias, 1);
        } else {
            const currentcount: number | undefined = locations.get(locationAlias);
            if(currentcount !== undefined){
                locations.set(locationAlias, currentcount + 1);
            }
          
        }
      }
    } else {
      const numberlocations: number = Math.abs(x1 - x2);
      const xslope: number = x1 < x2 ? 1 : -1;
      const yslope: number = y1 < y2 ? 1 : -1;
      for (let j = 0; j <= numberlocations; j++) {
        const locationAlias: string = `x${x1 + j * xslope}y${y1 + j * yslope}`;
        const checkLocationExists: boolean = locations.has(locationAlias);
        if (!checkLocationExists) {
          locations.set(locationAlias, 1);
        } else {
            const currentcount: number | undefined = locations.get(locationAlias);
            if(currentcount !== undefined){
                locations.set(locationAlias, currentcount + 1);
            }
          
        }
      }
    }
  }
  return locations;
};

const countCountsDiagonalHashTable = function (file: string): number {
  let total: number = 0;
  const filledmap: Map<string, number> = fillMapDiagonalHashTable(file);
  for (const value of filledmap.values()) {
    if (value > 1) {
      ++total;
    }
  }
  return total;
};

console.log(countCountsDiagonalHashTable("input.txt"));
