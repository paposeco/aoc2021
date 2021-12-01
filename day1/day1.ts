const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const measurementsStringArray: string[] = fileToString.split("\n");

  measurementsStringArray.pop();
  let measurements: number[] = measurementsStringArray.map((measurement) =>
    Number(measurement)
  );
  return measurements;
};

const countIncreasesFromFile = function (file: string): number {
  const getMeasurements: number[] = prepFile(file);
  let count: number = 0;
  for (let i = 1; i < getMeasurements.length; i++) {
    const currentMeasurement: number = getMeasurements[i];
    const previousMeasurement: number = getMeasurements[i - 1];
    if (currentMeasurement > previousMeasurement) {
      count++;
    }
  }
  return count;
};

const countIncreasesFromArray = function (newMeasurements: number[]): number {
  let count: number = 0;
  for (let i = 1; i < newMeasurements.length; i++) {
    const currentMeasurement: number = newMeasurements[i];
    const previousMeasurement: number = newMeasurements[i - 1];
    if (currentMeasurement > previousMeasurement) {
      count++;
    }
  }
  return count;
};

const sumThreeMeasurementsAndCount = function (file: string): number {
  const getMeasurements: number[] = prepFile(file);
  let arraySums: number[] = [];
  for (let i = 0; i < getMeasurements.length - 2; i++) {
    const sumOfThree: number =
      getMeasurements[i] + getMeasurements[i + 1] + getMeasurements[i + 2];
    arraySums.push(sumOfThree);
  }
  const countNewIncreases: number = countIncreasesFromArray(arraySums);
  return countNewIncreases;
};

console.log(sumThreeMeasurementsAndCount("input.txt"));
