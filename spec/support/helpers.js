const fs = require("fs");

const setup = () => {
    beforeEach(() => {
        /* we need to create a test folder in the root of the project
            and add several test files and subfolders to it with their own files
            */
        fs.mkdirSync("../test");
        fs.mkdirSync("../dev");
        fs.mkdirSync("../json_files_test");
        fs.mkdirSync("../test/subfolder");
        fs.writeFileSync("../test/test.txt", "test");
        fs.writeFileSync("../test/subfolder/test.txt", "test");

    });

    afterEach(() => {
        // remove the test folder and all its contents
        fs.rmdirSync("../test", { recursive: true, force: true });
        fs.rmdirSync("../dev", { recursive: true, force: true });
        fs.rmdirSync("../json_files_test", { recursive: true, force: true });
    });

};

module.exports = setup;
