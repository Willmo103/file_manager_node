const fs = require("fs");
const File = require("./file");
const IO = require("./io");

class Directory extends IO {
  constructor(filename, filepath) {
    // call the parent constructor to set the name and filepath properties
    super(filepath);

    // set the filename
    this.filename = filename

    // set the files and subdirectories as empty arrays
    this.files = [];
    this.subDirectories = [];

    // get all files from the path and create a new file or directory object for each
    fs.readdirSync(this.filepath).forEach((file) => {
      if (fs.lstatSync(`${this.filepath}/${file}`).isDirectory()) {
        this.subDirectories.push(
          new Directory(file, `${this.filepath}/${file}`)
        );
      } else {
        this.files.push(new File(`${this.filepath}/${file}`));
      }
    });
  }

  toJson() {
    // map the files and subdirectories arrays to JSON
    let filesJson = this.files.map((file) => file.toJson());
    let subDirectoriesJson = this.subDirectories.map((directory) =>
      directory.toJson()
    );

    return {
      filename: this.filename,
      filepath: this.filepath,
      files: filesJson,
      subDirectories: subDirectoriesJson,
    };
  }
}

module.exports = Directory;
