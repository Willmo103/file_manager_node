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
     * #### Inherited from IO class
     * ---
     * Asynchronously deletes the file or directory
     *
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
     * #### Inherited from IO class
     * ---
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

    /**
     * #### Inherited from IO class
     * ---
     * Asynchronously moves the file or directory to a new location.
     *
     * @param {string} dest - The path to the destination.
     * @returns {Promise} - A Promise that resolves to the new location of the file or directory. If an error occurs during moving, the Promise is rejected with an Error object.
     */
    async move(dest, callback) {
        return fs.promises.rename(this.filepath, dest, { overwrite: true, recursive: true })
            .then(() => {
                this.filepath = dest;
                callback(dest);
            })
            .catch((err) => {
                console.error(err);
                return Promise.reject(err);
            });
    }

    /**
     * #### Inherited from IO class
     * ---
     * Reads the contents of the file.
     *
     * @param {Function} callback - A callback function that will be called after the file is read. This function should update the instance's data property.
     * @returns {Promise} - A Promise that resolves to the value returned by the callback function. If an error occurs during reading, the Promise is rejected with an Error object.
     */
    async read(callback) {
        if (!(this instanceof File)) {
            throw new Error("The 'read' method can only be called on instances of the 'File' subclass.");
        }

        return fs.promises.readFile(this.filepath, "utf8")
            .then((data) => Promise.resolve(callback(data)))
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    }


    /**
     * #### Inherited from IO class
     * ---
     * Renames the file or directory and updates the instance's filepath and filename properties.
     *
     * @param {string} newName - The new name of the file or directory.
     * @param {Function} callback - A callback function that will be called after the file or directory is renamed. This function should update the instance's filepath and filename properties.
     * @returns {Promise} - A Promise that resolves to the value returned by the callback function. If an error occurs during renaming, the Promise is rejected with an Error object.
     */
    async rename(newName, callback) {
        const newFilePath = path.join(path.dirname(this.filepath), newName);
        return fs.promises.rename(this.filepath, newFilePath)
            .then(() => {
                this.filepath = newFilePath;
                this.filename = newName;
                callback(newFilePath);
            })
            .catch((err) => {
                console.error(err);
                return Promise.reject(err);
            });
    }

    /**
     * #### Inherited from IO class
     * ---
     * Fetches and returns the details of the file or directory.
     *
     * @param {boolean} verbose - Determines whether to return additional details. Defaults to false.
     * @returns {Promise} - A Promise that resolves to an object containing the file or directory details.
     */
    async details(verbose = false) {
        const details = await fs.promises.stat(this.filepath);
        const baseDetails = {
            isFile: details.isFile(),
            isDirectory: details.isDirectory(),
            size: details.size,
            creationTime: details.birthtime,
            modifiedTime: details.mtime,
        };

        if (verbose) {
            const owner = await fs.promises.lstat(this.filepath);
            return {
                ...baseDetails,
                blockSize: details.blksize,
                blocks: details.blocks,
                device: details.dev,
                hardLinks: details.nlink,
                inode: details.ino,
                accessTime: details.atime,
                userId: owner.uid,
                groupId: owner.gid,
            };
        }

        return baseDetails;
    }

}

module.exports = IO;
