class File {
  constructor(path) {
    this.filename = path.split("/").pop();
    this.path = path;
  }
}

export default File;
