const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  const inputArray: string[] = input[0].split(",");
  let initialFish = new Map<string, number>();
  initialFish.set("count0", 0);
  initialFish.set("count1", 0);
  initialFish.set("count2", 0);
  initialFish.set("count3", 0);
  initialFish.set("count4", 0);
  initialFish.set("count5", 0);
  initialFish.set("count6", 0);
  initialFish.set("count7", 0);
  initialFish.set("count8", 0);
  for (let i = 0; i < inputArray.length; i++) {
    const tonumber = Number(inputArray[i]);
    const alias: string = `count${tonumber}`;
    const checkLocationExists: boolean = initialFish.has(alias);
    if (checkLocationExists) {
      const currentcount: number | undefined = initialFish.get(alias);
      if (typeof currentcount === "number") {
        initialFish.set(alias, currentcount + 1);
      }
    }
  }
  return initialFish;
};

const runTimer = function (file: string) {
  let fishSchool: Map<string, number> = prepFile(file);
  let timer = 0;
  while (timer < 256) {
    const currentFishZero: number | undefined = fishSchool.get("count0");
    const currentFishOne: number | undefined = fishSchool.get("count1");
    const currentFishTwo: number | undefined = fishSchool.get("count2");
    const currentFishThree: number | undefined = fishSchool.get("count3");
    const currentFishFour: number | undefined = fishSchool.get("count4");
    const currentFishFive: number | undefined = fishSchool.get("count5");
    const currentFishSix: number | undefined = fishSchool.get("count6");
    const currentFishSeven: number | undefined = fishSchool.get("count7");
    const currentFishEight: number | undefined = fishSchool.get("count8");
    if (
      currentFishZero !== undefined &&
      currentFishOne !== undefined &&
      currentFishTwo !== undefined &&
      currentFishThree !== undefined &&
      currentFishFour !== undefined &&
      currentFishFive !== undefined &&
      currentFishSix !== undefined &&
      currentFishSeven !== undefined &&
      currentFishEight !== undefined
    ) {
      fishSchool.set("count6", currentFishZero + currentFishSeven);
      fishSchool.set("count8", currentFishZero);
      fishSchool.set("count7", currentFishEight);
      fishSchool.set("count5", currentFishSix);
      fishSchool.set("count4", currentFishFive);
      fishSchool.set("count3", currentFishFour);
      fishSchool.set("count2", currentFishThree);
      fishSchool.set("count1", currentFishTwo);
      fishSchool.set("count0", currentFishOne);
    }
    ++timer;
  }
  let totalnumberfish = 0;
  const numberfish = fishSchool.values();
  for (const fish of numberfish) {
    totalnumberfish += fish;
  }
  console.log(totalnumberfish);
};

runTimer("input.txt");
