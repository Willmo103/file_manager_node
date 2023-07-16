const fs = require('fs')
const IO = require('./io')

class File extends IO {
  constructor(filepath) {
    super(filepath)

    // parse the filename from the filepath
    if (!this.filepath.split("\\").pop()) {
      this.filename = this.filepath;
    } else {
      this.filename = this.filepath.split("\\").pop();
    }
  }

  toJson() {
    return {
      filename: this.filename,
      filepath: this.filepath,
    };
  }

}

module.exports = File;
