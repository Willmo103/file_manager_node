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
  //   it("should throw an error if the path does not exist", () => {
  //     expect(() => new Directory("test", "./test")).toThrow(
  //       Error("Path does not exist")
  //     );
  //   });

  it(".toJson method should return a json object", () => {
    const testDir = new Directory("test", testDirPath);
    const jsonData = testDir.toJson();
    let i = 0;
    for (key in jsonData) {
      console.log(i);
      console.log(key, jsonData[key]);
      if (key == "files") {
        j = 0;
        for (key2 in jsonData[key]) {
          console.log(key2, jsonData[key][key2]);
          console.log(j);
          if (key2 == "files") {
            k = 0;
            for (key3 in jsonData[key]) {
              console.log(key3, jsonData[key][key2]);
              console.log(k);
              k++;
            }
          }
          j++;
        }
      }
      i++;
    }
    expect(jsonData.name).toBe("test");
    // console.log("Name:", jsonData.name);

    // expect(jsonData.path).toBe(testDirPath);
    // console.log("Path", jsonData.path);

    // expect(jsonData.files.length).toBe(2);
    // console.log("Files length:", jsonData.files.length);

    // expect(jsonData.files[0].filename).toBe("subfolder");
    // console.log("Files [0]:", jsonData.files[0]);

    // expect(jsonData.files[1].filename).toBe("test.txt");
    // console.log("Files [1]:", jsonData.files[1]);

    // expect(jsonData.files[1].files[0].filename).toBe("test.txt");
    // console.log("Files [1] nested file:", jsonData.files[1].files);
  });
});
