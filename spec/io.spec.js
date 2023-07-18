const fs = require("fs");
const Directory = require("../directory");
const File = require("../file");
const path = require("path");
const setup = require("./support/helpers");
const IO = require("../io");

const testDirPath = path.resolve(setup());
const devDirPath = path.resolve(__dirname, "dev");

describe("IO - via File and Directory classes", () => {

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

        beforeEach(() => {
            testDir = new Directory("test", testDirPath);
        });

        it("should be instantiated correctly", () => {
            expect(testDir.filename).toBe("test");
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
            const testDir = new Directory("test", testDirPath)

            // call the toJson method of the directory object with the save flag
            testDir.toJson(true)

            // check if the file was created
            expect(fs.existsSync("./json_files/test.json")).toBeTrue();

            // clean up after the test
            fs.rmSync("./json_files/test.json")
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
        let testFile;
        beforeEach(() => {
            testFile = new File(path.resolve(testDirPath, "test.txt"));
        });

        it("should be instantiated correctly", () => {
            expect(testFile.filename).toBe("test.txt");
            expect(testFile.filepath).toBe(path.resolve(testDirPath, "test.txt"));
        });

        it(".toJson method should return a json object", () => {
            const jsonData = testFile.toJson();

            expect(jsonData.filename).toBe("test.txt");
            expect(jsonData.filepath).toBe(path.resolve(testDirPath, "test.txt"));
            expect(jsonData.extension).toBe("txt");
        });
    });
});
