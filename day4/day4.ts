interface NumberOnBoard {
  nmb: number;
  found: boolean;
}

const prepFile = function (file: string): [number[], NumberOnBoard[][]] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  const drawOrderString = input[0].split(",");
  const drawOrder = drawOrderString.map((order) => Number(order));
  let boards: NumberOnBoard[][] = [];
  for (let i = 2; i < input.length; i++) {
    let currentboard: string[] = [];
    currentboard.push(
      input[i],
      input[i + 1],
      input[i + 2],
      input[i + 3],
      input[i + 4]
    );
    const joinedboard = currentboard.join();
    const nocomma = joinedboard.replace(/,/g, " ");
    const nodoublespace = nocomma.replace(/  /g, " ");
    const trimmed = nodoublespace.trim();
    const separatestring = trimmed.split(" ");
    const finalarray: NumberOnBoard[] = separatestring.map((numberonboard) => {
      let newobj = { nmb: Number(numberonboard), found: false };
      return newobj;
    });
    boards.push(finalarray);
    i += 5;
  }
  return [drawOrder, boards];
};

const boardsInArrayForm = function (file: string): NumberOnBoard[][][] {
  const input = prepFile(file)[1];
  let newinput: NumberOnBoard[][][] = [];
  for (let i = 0; i < input.length; i++) {
    const currentboard = input[i];
    let newboard: NumberOnBoard[][] = [];
    for (let j = 0; j < currentboard.length; j++) {
      const row = [
        currentboard[j],
        currentboard[j + 1],
        currentboard[j + 2],
        currentboard[j + 3],
        currentboard[j + 4],
      ];
      newboard.push(row);
      j += 4;
    }
    newinput.push(newboard);
  }
  return newinput;
};

const horizontalBingo = function (board: NumberOnBoard[][]) {
  let found = false;
  for (let i = 0; i < board.length; i++) {
    let currentrow = board[i];
    let bingo: boolean =
      currentrow[0].found &&
      currentrow[1].found &&
      currentrow[2].found &&
      currentrow[3].found &&
      currentrow[4].found;
    if (bingo) {
      found = true;
      break;
    }
  }
  return found;
};

const verticalBingo = function (board: NumberOnBoard[][]) {
  let found = false;
  for (let i = 0; i < 5; i++) {
    let bingo: boolean =
      board[0][i].found &&
      board[1][i].found &&
      board[2][i].found &&
      board[3][i].found &&
      board[4][i].found;
    if (bingo) {
      found = true;
      break;
    }
  }
  return found;
};

const checkBoardForBingo = function (
  draworder: number[],
  board: NumberOnBoard[][]
): number {
  let numbersfound = 0;
  let lastdrawnnumber: number = -1;
  for (let i = 0; i < draworder.length; i++) {
    const currentnumber = draworder[i];
    for (let j = 0; j < board.length; j++) {
      const currentrow = board[j];
      const indexcurrentnumberonrow: number = currentrow.findIndex(
        (obj) => obj.nmb === currentnumber
      );
      if (indexcurrentnumberonrow !== -1) {
        board[j][indexcurrentnumberonrow].found = true;
        ++numbersfound;
      }
    }
    if (numbersfound >= 5) {
      const verticalbingo = verticalBingo(board);
      if (verticalbingo) {
        lastdrawnnumber = i;
        break;
      } else {
        const horizontalbingo = horizontalBingo(board);
        if (horizontalbingo) {
          lastdrawnnumber = i;
          break;
        }
      }
    }
  }
  return lastdrawnnumber;
};

const findBestBoard = function (file: string): [NumberOnBoard[][], number] {
  const prepareFile = prepFile(file);
  const draworder = prepareFile[0];
  const boards = boardsInArrayForm(file);
  let bestindex: number = -1;
  let bestboard: number = -1;
  for (let i = 0; i < boards.length; i++) {
    const currentboard = boards[i];
    const currentbingoindex: number = checkBoardForBingo(
      draworder,
      currentboard
    );
    if (bestindex === -1 || bestindex > currentbingoindex) {
      bestindex = currentbingoindex;
      bestboard = i;
    }
  }
  return [boards[bestboard], draworder[bestindex]];
};

const calculateScore = function (file: string): number {
  const findboard: [NumberOnBoard[][], number] = findBestBoard(file);
  console.log(findboard[0]);
  let sumUnmarkedNumbers: number = 0;
  for (let i = 0; i < findboard[0].length; i++) {
    const row = findboard[0][i];
    for (let j = 0; j < row.length; j++) {
      const currentnumber = row[j];
      if (currentnumber.found === false) {
        sumUnmarkedNumbers += currentnumber.nmb;
      }
    }
  }
  return findboard[1] * sumUnmarkedNumbers;
};

// part 2

const findWorstBoard = function (file: string): [NumberOnBoard[][], number] {
  const prepareFile = prepFile(file);
  const draworder = prepareFile[0];
  const boards = boardsInArrayForm(file);
  let bestindex: number = -1;
  let worstboard: number = -1;
  for (let i = 0; i < boards.length; i++) {
    const currentboard = boards[i];
    const currentbingoindex: number = checkBoardForBingo(
      draworder,
      currentboard
    );
    if (bestindex === -1 || bestindex < currentbingoindex) {
      bestindex = currentbingoindex;
      worstboard = i;
    }
  }
  return [boards[worstboard], draworder[bestindex]];
};

const calculateNewScore = function (file: string): number {
  const findboard: [NumberOnBoard[][], number] = findWorstBoard(file);
  console.log(findboard[0]);
  let sumUnmarkedNumbers: number = 0;
  for (let i = 0; i < findboard[0].length; i++) {
    const row = findboard[0][i];
    for (let j = 0; j < row.length; j++) {
      const currentnumber = row[j];
      if (currentnumber.found === false) {
        sumUnmarkedNumbers += currentnumber.nmb;
      }
    }
  }
  return findboard[1] * sumUnmarkedNumbers;
};

console.log(calculateNewScore("input.txt"));
