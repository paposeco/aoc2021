const prepFile = function (file: string): string[] {
  const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  const input: string[] = fileToString.split("\n");
  input.pop();
  return input;
};

const storeLocations = function(file: string): Map<string, string[]>{
    const input = prepFile(file);
    let locations: Map<string, string[]> = new Map();
    for(let i = 0; i < input.length; i++){
        const path = input[i].split("-");
        const pathfrom = path[1];
        const pathto = path[0];
        if(locations.has(pathfrom)){
            let pathToStored = locations.get(pathfrom);
            const updatePathTo = [...pathToStored, pathto];
            locations.set(pathfrom, updatePathTo);
        }else{
            locations.set(pathfrom, [pathto]);
        }
    }
    return location;
}

const countPaths = function(file: string){
    const locations = storeLocations(file);
    const numberLocations = locations.size;
    const endpoint = locations.get("end");
    if(endpoint !== undefined){
        for(let i = 0; i < endpoint.length; i++){
            const connector = endpoint[i];

        }
    }
    // o endpoint vai mudar 

}

storeLocations("inputmini.txt");
