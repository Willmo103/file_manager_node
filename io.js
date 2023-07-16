const path = require("path");
const fs = require("fs");

class IO {
    constructor(filepath) {
        // block this class from being instantiated from the constructor
        if (new.target == IO) {
            throw new TypeError("Cannot construct IO instances directly");
        }
        // set the name property
        const absPath = path.resolve(filepath);
        if (fs.existsSync(absPath)) {
            this.filepath = absPath;
        } else {
            throw new Error("Path does not exist");
        }
    }


    /**
     * Asynchronously deletes the file or directory
     * @returns {Boolean} True for successful deletion and false for unsuccessful deletion.
     */
    async delete() {
        return fs.promises.rm(this.filepath, { recursive: true, force: true })
            .then(() => true)
            .catch((err) => {
                console.error(err);
                return false;
            });
    }


    /**
     * Asynchronously copies the file or directory to a new location.
     *
     * @param {string} dest - The path to the destination.
     * @param {Function} callback - A callback function that will be called after the file is copied. This function should return a new class instance from the provided path.
     * @returns {Promise} - A Promise that resolves to the value returned by the callback function. If an error occurs during copying, the Promise is rejected with an Error object.
     */
    async copy(dest, callback) {
        return fs.promises.cp(this.filepath, dest)
            .then(() => Promise.resolve(callback(dest)))
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    }


}

module.exports = IO
