const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

const incompleteLines = function(file: string){
    const input= prepFile(file);
    for(let i = 0; i < input.length; i++){
        console.log(input[i].length);
    }
}

incompleteLines("inputmini.txt");
