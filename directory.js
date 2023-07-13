import { fs } from "fs";
import File from "./file.js";

class Directory {
  constructor(name, path) {
    // check path exists
    if (!fs.existsSync(path)) {
      throw new Error("Path does not exist");
    }
    // set the path and name
    this.path = path;

    // set the files as an empty array
    this.files = [];
    // get all files from the path and create a new file object for each
    fs.readdirSync(path).forEach((file) => {
      // check if the file is a directory if it is create a new directory object and push in into the files array
      if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
        this.files.push(new Directory(file, `${path}/${file}`));
        return;
      }
      // push the new file object to the files array
      this.files.push(new File(`${path}/${file}`));
    });

    // set the name
    this.name = name;
  }
}

export default Directory;
