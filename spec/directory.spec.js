const fs = require("fs");
const Directory = require("../directory");
const File = require("../file");
const path = require("path");

// create a test directory path
const testDirPath = path.resolve("../test");

beforeEach(() => {
  /* we need to create a test folder in the root of the project
        and add several test files and subfolders to it with their own files
        */
  fs.mkdirSync("../test");
  fs.mkdirSync("../test/subfolder");
  fs.writeFileSync("../test/test.txt", "test");
  fs.writeFileSync("../test/subfolder/test.txt", "test");
});

afterEach(() => {
  // remove the test folder and all its contents
  fs.rmdirSync("../test", { recursive: true, force: true });
});

describe("Directory", () => {
  it("should throw an error if the path does not exist", () => {
    expect(() => new Directory("test", "./test")).toThrow(
      Error("Path does not exist")
    );
  });

  it(".toJson method should return a json object", () => {
    // create the test object from the created test path
    const testDir = new Directory("test", testDirPath);
    //call the toJson method of the directory object
    const jsonData = testDir.toJson();
    // check the "name"
    console.log(jsonData)
    expect(jsonData.filename).toBe("test");

    // check the path
    expect(jsonData.filepath).toBe(testDirPath);

    // number of files in the "files" array
    expect(jsonData.files.length).toBe(1);

    // check the files in the "files" array for "filename" and "path"
    expect(jsonData.files[0].filename).toBe("test.txt");
    expect(jsonData.files[0].filepath).toBe(path.resolve(testDirPath, "test.txt"));

    // check the directories in the "subdirectories" array
    expect(jsonData.subDirectories.length).toBe(1);

    // check the "name" and "path" of the object in the "subdirectories" array
    expect(jsonData.subDirectories[0].filename).toBe("subfolder");
    expect(jsonData.subDirectories[0].filepath).toBe(
      path.resolve(testDirPath, "subfolder")
    );

    // check the length of the "files" array of the object in the "subdirectories" array
    expect(jsonData.subDirectories[0].files.length).toBe(1);

    // check the "name" and "path" of the object in the "files" array of the object in the "subdirectories" array
    expect(jsonData.subDirectories[0].files[0].filename).toBe("test.txt");
  });

  it(".toJson with passed with the save flag should save the json to a file", () => {
    const testDir = new Directory("test", testDirPath)
    testDir.toJson(true)
    expect(fs.existsSync("./test.json")).toBeTrue();
    fs.rmSync("./test.json")
  })
});
