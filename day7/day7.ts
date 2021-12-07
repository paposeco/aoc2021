const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n")[0].split(",");
  const tonumber = input.map((element) => Number(element));
  return tonumber;
};

const calculateLocationsRepeats = function (file: string) {
  const crabs = prepFile(file);
  let repeats = new Map<string, number>();
  for (let i = 0; i < crabs.length; i++) {
    const currentcrab = crabs[i];
    const alias: string = "crabAt" + currentcrab;
    if (repeats.has(alias)) {
      const currentcount = repeats.get(alias);
      if (currentcount !== undefined) {
        repeats.set(alias, currentcount + 1);
      }
    } else {
      repeats.set(alias, 1);
    }
  }
  return repeats;
};

const calculateAverage = function (file: string) {
  const crabsLocations = prepFile(file);
  const numberlocations = crabsLocations.length;
  const sum = crabsLocations.reduce(
    (previousValue: number, currentValue: number) =>
      previousValue + currentValue,
    0
  );
  return sum / numberlocations;
};

//part 1: trying all positions
const calculateFuelBruteForce = function (file: string) {
  const repeats = calculateLocationsRepeats(file);
  let fuel = 0;
  for (const key of repeats.keys()) {
    let currentfuel = 0;
    let alias: string = key;
    let extractNumber: number = Number(alias.substring(6));
    for (const dkey of repeats.keys()) {
      const currentalias: string = dkey;
      let currentExtractNumber: number = Number(currentalias.substring(6));
      const crabcount = repeats.get(currentalias);
      if (currentExtractNumber !== extractNumber && crabcount !== undefined) {
        currentfuel +=
          Math.abs(currentExtractNumber - extractNumber) * crabcount;
      }
    }
    fuel > currentfuel || fuel === 0 ? (fuel = currentfuel) : null;
  }
  return fuel;
};

//part 2

const calculateFuelWithAverage = function (file: string) {
  const average = calculateAverage(file);
  const averagefloor = Math.floor(average);
  const averageceil = Math.ceil(average);
  const repeats = calculateLocationsRepeats(file);
  let fuelfloor = 0;
  let fuelceil = 0;

  for (const dkey of repeats.keys()) {
    const currentalias: string = dkey;
    let currentExtractNumber: number = Number(currentalias.substring(6));
    const crabcount = repeats.get(currentalias);
    if (currentExtractNumber !== averagefloor && crabcount !== undefined) {
      const distance = Math.abs(currentExtractNumber - averagefloor);
      const sum = (distance * (distance + 1)) / 2;
      fuelfloor += sum * crabcount;
    }
    if (currentExtractNumber !== averageceil && crabcount !== undefined) {
      const distance = Math.abs(currentExtractNumber - averageceil);
      const sum = (distance * (distance + 1)) / 2;
      fuelceil += sum * crabcount;
    }
  }
  return Math.min(fuelfloor, fuelceil);
};

// my first instinct was to try with the average, but the average was xxx.5 and I only tried it with Math.ceil. I then went through all possible numbers, found the result and realized that I should have tried with Math.floor while using the average. So below is brute force version
const possiblePositions = function (file: string) {
  const crabsLocations = prepFile(file);
  let min = 0;
  let max = 0;
  for (let i = 0; i < crabsLocations.length; i++) {
    crabsLocations[i] > max ? (max = crabsLocations[i]) : null;
    crabsLocations[i] < min ? (min = crabsLocations[i]) : null;
  }
  return [min, max];
};

const calculateFuelBruteForceMoreExpensive = function (file: string) {
  const repeats = calculateLocationsRepeats(file);
  const possiblepositions = possiblePositions(file);
  let fuel = 0;
  for (let i = possiblepositions[0]; i <= possiblepositions[1]; i++) {
    let currentfuel = 0;
    let extractNumber = i;
    for (const dkey of repeats.keys()) {
      const currentalias: string = dkey;
      let currentExtractNumber: number = Number(currentalias.substring(6));
      const crabcount = repeats.get(currentalias);
      if (currentExtractNumber !== extractNumber && crabcount !== undefined) {
        const distance = Math.abs(currentExtractNumber - extractNumber);
        const sum = (distance * (distance + 1)) / 2;
        currentfuel += sum * crabcount;
      }
    }
    fuel > currentfuel || fuel === 0 ? (fuel = currentfuel) : null;
  }
  return fuel;
};
