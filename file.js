const fs = require("fs");

class File {
  constructor(path) {
    if (!path.split("/").pop()) {
      this.filename = path;
    } else {
      this.filename = path.split("/").pop();
    }
    this.path = path;
  }

  toJson() {
    return {
      filename: this.filename,
      path: this.path,
    };
  }

  delete() {
    fs.rm(this.path, (err) => {
      if (err) return false;
    });
    return true;
  }
}

module.exports = File;
