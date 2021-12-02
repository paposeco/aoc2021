interface Instruction {
  direction: string;
  movementvalue: number;
}

const prepFile = function (file: string) {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const instructions: string[] = fileToString.split("\n");
  instructions.pop();

  let instructionsDict: Instruction[] = [];

  instructions.map((instruction) => {
    const completeInstruction: string[] = instruction.split(" ");
    instructionsDict.push({
      direction: completeInstruction[0],
      movementvalue: Number(completeInstruction[1]),
    });
  });
  return instructionsDict;
};

// first enum of my life
enum Direction {
  forward,
  up,
  down,
  invalid,
}

//part 1
const getDirection = function (currentdirection: string): Direction {
  let foundDirection: Direction = Direction.invalid;
  switch (currentdirection) {
    case "forward": {
      foundDirection = Direction.forward;
      break;
    }
    case "up": {
      foundDirection = Direction.up;
      break;
    }
    case "down": {
      foundDirection = Direction.down;
      break;
    }
    default: {
      console.log("error");
    }
  }
  return foundDirection;
};

const calculateFinalLocation = function (file: string) {
  const instructions: Instruction[] = prepFile(file);
  let x: number = 0;
  let y: number = 0;

  for (let i = 0; i < instructions.length; i++) {
    const currentdirection = getDirection(instructions[i].direction);
    const movementvalue = instructions[i].movementvalue;
    switch (currentdirection) {
      case Direction.forward: {
        x += movementvalue;
        break;
      }
      case Direction.up: {
        y -= movementvalue;
        break;
      }
      case Direction.down: {
        y += movementvalue;
      }
    }
  }
  return x * y;
};

//part 2

const calculateNewFinalLocation = function (file: string) {
  const instructions: Instruction[] = prepFile(file);
  let x: number = 0;
  let y: number = 0;
  let aim: number = 0;

  for (let i = 0; i < instructions.length; i++) {
    const currentdirection = getDirection(instructions[i].direction);
    const movementvalue = instructions[i].movementvalue;
    switch (currentdirection) {
      case Direction.forward: {
        x += movementvalue;
        y += aim * movementvalue;
        break;
      }
      case Direction.up: {
        aim -= movementvalue;
        break;
      }
      case Direction.down: {
        aim += movementvalue;
      }
    }
  }
  return x * y;
};

console.log(calculateNewFinalLocation("input.txt"));
