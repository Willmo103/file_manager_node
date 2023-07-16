const fs = require("fs");
const File = require("./file");
const path = require("path");

class Directory {
  constructor(name, _path) {
    // create an absolute path from the path argument
    const absPath = path.resolve(_path);

    // check path exists
    if (!fs.existsSync(absPath)) {
      throw new Error("Path does not exist");
    }

    // set the path and name
    this.path = absPath;

    // set the files and subdirectories as empty arrays
    this.files = [];
    this.subDirectories = [];

    // get all files from the path and create a new file or directory object for each
    fs.readdirSync(this.path).forEach((file) => {
      if (fs.lstatSync(`${this.path}/${file}`).isDirectory()) {
        this.subDirectories.push(new Directory(file, `${this.path}/${file}`));
      } else {
        this.files.push(new File(`${this.path}/${file}`));
      }
    });

    // set the name
    this.name = name;
  }

  toJson() {
    // map the files and subdirectories arrays to JSON
    let filesJson = this.files.map((file) => file.toJson());
    let subDirectoriesJson = this.subDirectories.map((directory) =>
      directory.toJson()
    );

    return {
      name: this.name,
      path: this.path,
      files: filesJson,
      subDirectories: subDirectoriesJson,
    };
  }
}

module.exports = Directory;
