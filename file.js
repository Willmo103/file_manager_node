class File {
  constructor(path) {
    this.filename = path.split("/").pop();
    this.path = path;
  }

  toJson() {
    return {
      filename: this.filename,
      path: this.path,
    };
  }
}

export default File;
