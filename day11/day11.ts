const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

const octopiStart = function (file: string) {
  const input = prepFile(file);
  const octopimap: Map<
    string,
    { valueonlocation: number; flashedthisturn: boolean }
  > = new Map();
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const octupusalias = `${j},${i}`;
      octopimap.set(octupusalias, {
        valueonlocation: Number(input[i][j]),
        flashedthisturn: false,
      });
    }
  }
  return octopimap;
};

const runSteps = function (file: string) {
  const input = prepFile(file);
  const octopimap = octopiStart(file);
  let steps = 0;
  let numberflashes = 0;
  while (steps < 100) {
    let flashedOctopi = [];
    for (const [key, value] of octopimap) {
      if (value.valueonlocation !== 9) {
        octopimap.set(key, {
          valueonlocation: value.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else {
        octopimap.set(key, { valueonlocation: 0, flashedthisturn: true });
        flashedOctopi.push(key);
        numberflashes += 1;
      }
    }
    const updatedadjacentoctupus = checkAdjacentOctupus(
      flashedOctopi,
      octopimap,
      numberflashes
    );
    numberflashes = updatedadjacentoctupus[1];
    steps += 1;
  }
  return numberflashes;
};

const checkAdjacentOctupus = function (
  flashedOctopi: string[],
  octopimap: Map<string, { valueonlocation: number; flashedthisturn: boolean }>,
  flashes: number
): [
  Map<string, { valueonlocation: number; flashedthisturn: boolean }>,
  number
] {
  let newFlashedOctopi: string[] = [];
  let updatedFlashes = flashes;
  for (let i = 0; i < flashedOctopi.length; i++) {
    const flashedOctupus = flashedOctopi[i].split(",");
    const flashedOctupusJ = Number(flashedOctupus[0]);
    const flashedOctupusI = Number(flashedOctupus[1]);
    const north = octopimap.get(`${flashedOctupusJ},${flashedOctupusI - 1}`);
    if (north !== undefined) {
      if (!north.flashedthisturn && north.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ},${flashedOctupusI - 1}`, {
          valueonlocation: north.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (!north.flashedthisturn && north.valueonlocation === 9) {
        newFlashedOctopi.push(`${flashedOctupusJ},${flashedOctupusI - 1}`);
        octopimap.set(`${flashedOctupusJ},${flashedOctupusI - 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const south = octopimap.get(`${flashedOctupusJ},${flashedOctupusI + 1}`);
    if (south !== undefined) {
      if (!south.flashedthisturn && south.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ},${flashedOctupusI + 1}`, {
          valueonlocation: south.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (!south.flashedthisturn && south.valueonlocation === 9) {
        newFlashedOctopi.push(`${flashedOctupusJ},${flashedOctupusI + 1}`);
        octopimap.set(`${flashedOctupusJ},${flashedOctupusI + 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const west = octopimap.get(`${flashedOctupusJ - 1},${flashedOctupusI}`);
    if (west !== undefined) {
      if (!west.flashedthisturn && west.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI}`, {
          valueonlocation: west.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (!west.flashedthisturn && west.valueonlocation === 9) {
        newFlashedOctopi.push(`${flashedOctupusJ - 1},${flashedOctupusI}`);
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const east = octopimap.get(`${flashedOctupusJ + 1},${flashedOctupusI}`);
    if (east !== undefined) {
      if (!east.flashedthisturn && east.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI}`, {
          valueonlocation: east.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (!east.flashedthisturn && east.valueonlocation === 9) {
        newFlashedOctopi.push(`${flashedOctupusJ + 1},${flashedOctupusI}`);
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const northwest = octopimap.get(
      `${flashedOctupusJ - 1},${flashedOctupusI - 1}`
    );
    if (northwest !== undefined) {
      if (!northwest.flashedthisturn && northwest.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI - 1}`, {
          valueonlocation: northwest.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (
        !northwest.flashedthisturn &&
        northwest.valueonlocation === 9
      ) {
        newFlashedOctopi.push(`${flashedOctupusJ - 1},${flashedOctupusI - 1}`);
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI - 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const northeast = octopimap.get(
      `${flashedOctupusJ + 1},${flashedOctupusI - 1}`
    );
    if (northeast !== undefined) {
      if (!northeast.flashedthisturn && northeast.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI - 1}`, {
          valueonlocation: northeast.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (
        !northeast.flashedthisturn &&
        northeast.valueonlocation === 9
      ) {
        newFlashedOctopi.push(`${flashedOctupusJ + 1},${flashedOctupusI - 1}`);
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI - 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }

    const southwest = octopimap.get(
      `${flashedOctupusJ - 1},${flashedOctupusI + 1}`
    );
    if (southwest !== undefined) {
      if (!southwest.flashedthisturn && southwest.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI + 1}`, {
          valueonlocation: southwest.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (
        !southwest.flashedthisturn &&
        southwest.valueonlocation === 9
      ) {
        newFlashedOctopi.push(`${flashedOctupusJ - 1},${flashedOctupusI + 1}`);
        octopimap.set(`${flashedOctupusJ - 1},${flashedOctupusI + 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
    const southeast = octopimap.get(
      `${flashedOctupusJ + 1},${flashedOctupusI + 1}`
    );
    if (southeast !== undefined) {
      if (!southeast.flashedthisturn && southeast.valueonlocation !== 9) {
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI + 1}`, {
          valueonlocation: southeast.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else if (
        !southeast.flashedthisturn &&
        southeast.valueonlocation === 9
      ) {
        newFlashedOctopi.push(`${flashedOctupusJ + 1},${flashedOctupusI + 1}`);
        octopimap.set(`${flashedOctupusJ + 1},${flashedOctupusI + 1}`, {
          valueonlocation: 0,
          flashedthisturn: true,
        });
        updatedFlashes += 1;
      }
    }
  }
  if (newFlashedOctopi.length > 0) {
    return checkAdjacentOctupus(newFlashedOctopi, octopimap, updatedFlashes);
  }
  return [octopimap, updatedFlashes];
};

// part 2

const countFlashes = function (
  octopimap: Map<string, { valueonlocation: number; flashedthisturn: boolean }>
) {
  let alltrue = false;
  for (const [key, value] of octopimap) {
    if (value.flashedthisturn) {
      alltrue = true;
    } else {
      return false;
    }
  }
  return alltrue;
};

const runStepsAllFlashing = function (file: string) {
  const input = prepFile(file);
  const octopimap = octopiStart(file);
  let steps = 0;
  let numberflashes = 0;
  let allflashing = false;
  while (!allflashing) {
    let flashedOctopi = [];
    for (const [key, value] of octopimap) {
      if (value.valueonlocation !== 9) {
        octopimap.set(key, {
          valueonlocation: value.valueonlocation + 1,
          flashedthisturn: false,
        });
      } else {
        octopimap.set(key, { valueonlocation: 0, flashedthisturn: true });
        flashedOctopi.push(key);
        numberflashes += 1;
      }
    }
    const updatedadjacentoctupus = checkAdjacentOctupus(
      flashedOctopi,
      octopimap,
      numberflashes
    );
    numberflashes = updatedadjacentoctupus[1];
    // set every flashed to false
    steps += 1;
    allflashing = countFlashes(octopimap);
  }
  return steps;
};

console.log(runStepsAllFlashing("input.txt"));
