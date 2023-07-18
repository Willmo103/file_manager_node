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

    // parse the extension from the filename
    let extension = this.filename.split(".").pop();

    if (extension === this.filename) {
      this.extension = null;
    } else {
      this.extension = extension;
    }
  }

  toJson() {
    return {
      filename: this.filename,
      filepath: this.filepath,
      extension: this.extension,
    };
  }

}

module.exports = File;
