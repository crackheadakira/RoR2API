console.clear();
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

const apiURL = `http://localhost:${PORT}`;

app.use(express.json());
app.listen(PORT, () => console.log(`API is active at ${apiURL}`));
app.get('/', (req, res) => {
    res.send("This is the start page.");
});

app.get("/items/passive/all", (req, res) => {
    let fileArray = [];
    let filestoShow = [];
    showAll(`${__dirname}/items`, fileArray);
    for (file of fileArray) {
        file = file.replace('.json', '').replace(__dirname, '');
        filestoShow.push(showFile(file));
    }
    res.json(filestoShow)
});

makeGET(); // Allows you to access the first basic categories of items
makeGET("/items");
for (item of showDirURL(`/items`)) {
    makeGETid(item);
    makeGETItems(item);
}


// FUNCTIONS BELOW

/**
 *  Automatically create a possible api gateway for each folder in specified directory
 * @param {String} directory The URL returned by REST
 */

function makeGET(directory = "") {
    directory = showDirURL(directory);
    for (folder of directory) {
        app.get(folder, (req, res) => {
            res.json(showDir(req.url));
        });
    }
}

/**
 *  Automatically create a possible api gateway to use ID for each folder in specified directory
 * @param {String} directory The URL returned by REST
 */

function makeGETid(directory) {
    directory = showDirURL(directory);
    for (folder of directory) {
        folder = `${folder}/:id`
        app.get(folder, (req, res) => {
            let { id } = req.params;
            id = parseInt(id.toString().replace(/[^\w\s]/gi, ''));

            if (isNaN(id)) {
                res.status(401);
                return res.send("Unauthorized.");
            }

            res.json(showFile(req.url));
        });
    }
}

/**
 *  Automatically create a possible api gateway for each folder in specified directory
 * @param {String} directory The URL returned by REST
 * @returns {never}
 */

function makeGETItems(directory) {
    directory = showDirURL(directory);
    for (folder of directory) {
        app.get(folder, (req, res) => {
            res.json(showItems(req.url));
        });
    };
}

/**
 *  Shows the content of the specified file.
 * @param {String} directory The URL returned by REST
 * @returns {JSON}
 */

function showFile(directory) {
    return JSON.parse(fs.readFileSync(`${__dirname}${directory}.json`));
};

/**
 *  Shows a preview of all the items in specified directory.
 * @param {String} directory The URL returned by REST
 * @returns {Array}
 */

function showItems(directory) {
    const basicDir = `${__dirname}${directory}`;
    const dir = fs.readdirSync(basicDir);
    let fileArray = [];

    for (file of dir) {
        const fileInfo = JSON.parse(fs.readFileSync(`${basicDir}/${file}`));
        if (file.indexOf('.json') !== -1) { file = file.replace('.json', '') }
        let URL = `${apiURL}${directory}/${file}`.replaceAll('//', "/").replace('http:/', 'http://').replace('https:/', 'https://');
        fileArray.push({
            id: fileInfo.id,
            name: fileInfo.title,
            url: URL
        })
    }
    return fileArray;
}

/**
 * Shows all the folders in specified directory with the URL
 * @param {String} directory The URL returned by REST
 * @returns {Array}
 */

function showDirURL(directory) {
    const dir = fs.readdirSync(`${__dirname}${directory}`);
    let newDir = [];
    for (folder of dir) {
        newDir.push(`${directory}/${folder}`);
    }
    return newDir;
}

/**
 * Shows all the folder names in specified directory
 * @param {String} directory The URL returned by REST
 * @returns {Array}
 */

function showDir(directory) {
    const dir = fs.readdirSync(`${__dirname}${directory}`);
    let dirInfo = [];

    for (folder of dir) {
        let URL = `${apiURL}${directory}/${folder}`.replaceAll('//', "/").replace('http:/', 'http://').replace('https:/', 'https://');
        dirInfo.push({
            rarity: folder,
            URL: URL
        });
    }
    return dirInfo;
}

/**
 * Will recursively read the directory then show all the items
 * @param {String} directory The directory to start reading from
 * @param {Array} array The array to push the found files to
 * @returns {null}
 */

function showAll(directory, array) {
    fs.readdirSync(directory).forEach(function (file) {
        var subpath = path.join(directory, file)
        if (fs.lstatSync(subpath).isDirectory()) {
            showAll(subpath, array);
        } else {
            array.push(path.join(directory, file))
        }
    });
}