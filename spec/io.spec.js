const fs = require("fs");
const Directory = require("../directory");
const File = require("../file");
const path = require("path");
const setup = require("./support/helpers");
const IO = require("../io");

const testDirPath = path.resolve("../test");
const devDirPath = path.resolve("../dev");
const jsonDirPath = path.resolve("../json_files_test");

describe("IO - via File and Directory classes", () => {
    setup();

    it("should throw if abstract class IO is instantiated directly", () => {
        expect(() => new IO("./test.txt")).toThrow(TypeError("Cannot construct IO instances directly"));
    });

    it("should throw an error if the path does not exist for File", () => {
        expect(() => new File("./test.txt")).toThrow(Error("Path does not exist"));
    });

    it("should throw an error if the path does not exist for Directory", () => {
        expect(() => new Directory("test", "./test")).toThrow(Error("Path does not exist"));
    });

    describe("Directory", () => {
        let testDir;

        // create a test directory before each test
        beforeEach(() => {
            testDir = new Directory("test", testDirPath);
        });


        it("should be instantiated correctly", () => {
            // check the name and path
            expect(testDir.filename).toBe("test");

            // check the path
            expect(testDir.filepath).toBe(testDirPath);
        });

        it(".toJson method should return a json object", () => {

            // create the test object from the created test path
            const testDir = new Directory("test", testDirPath);
            //call the toJson method of the directory object
            const jsonData = testDir.toJson();
            // check the "name"
            expect(jsonData.filename).toBe("test");

            // check the path
            expect(jsonData.filepath).toBe(testDirPath);

            // number of files in the "files" array
            expect(jsonData.files.length).toBe(1);

            // check the files in the "files" array for "filename" and "path"
            expect(jsonData.files[0].filename).toBe("test.txt");
            expect(jsonData.files[0].filepath).toBe(path.resolve(testDirPath, "test.txt"));
            expect(jsonData.files[0].extension).toBe("txt");

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
            expect(jsonData.subDirectories[0].files[0].filepath).toBe(
                path.resolve(testDirPath, "subfolder", "test.txt")
            );
            expect(jsonData.subDirectories[0].files[0].extension).toBe("txt");
        });

        it(".toJson with save flag should save the json to a file", () => {

            // create the test object from the created test path
            const testDir = new Directory("test", testDirPath);

            // call the toJson method of the directory object with the save flag
            testDir.toJson(true, jsonDirPath + "/test.json")

            // check if the file was created
            expect(fs.existsSync(jsonDirPath + "/test.json")).toBeTrue();

        });

        it("should properly delete a directory", async () => {
            // create the test object from the created test path
            const testDir = new Directory("test", testDirPath);

            // delete the directory
            await testDir.delete();

            // check if the directory was deleted
            expect(fs.existsSync(testDirPath)).toBeFalse();

            // recreate the directory so the afterEach hook can delete it
            fs.mkdirSync(testDirPath);
        });

        it("should properly copy a directory", async () => {

            // create the test object from the created test path
            const testDir = new Directory("test", testDirPath);

            // set a new path for the copied directory
            const newPath = path.resolve(devDirPath, testDir.filename);

            // copy the directory
            const copiedPath = await testDir.copy(newPath, (path) => {
                return path
            });

            // check if the directory was copied
            expect(fs.existsSync(copiedPath)).toBeTrue();

            // clean up after the test
            fs.rmSync(newPath, { recursive: true, force: true });
        });

    });

    describe("File", () => {

        // create a test file before each test
        let testFile;
        beforeEach(() => {
            testFile = new File(path.resolve(testDirPath, "test.txt"));
        });

        it("should be instantiated correctly", () => {

            // check the name and path
            expect(testFile.filename).toBe("test.txt");

            // check the path
            expect(testFile.filepath).toBe(path.resolve(testDirPath, "test.txt"));
        });

        it(".toJson method should return a json object", () => {

            // call the toJson method of the file object
            const jsonData = testFile.toJson();

            // check the "name"
            expect(jsonData.filename).toBe("test.txt");

            // check the path
            expect(jsonData.filepath).toBe(path.resolve(testDirPath, "test.txt"));

            // check the extension
            expect(jsonData.extension).toBe("txt");
        });
    });
});
