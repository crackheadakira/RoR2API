console.clear();
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

const apiURL = `http://localhost:${PORT}`;

app.use(express.json());
app.listen(PORT, () => console.log(`API is active at ${apiURL}`));
app.get('/', (req, res) => {
    res.send("This is the start page.");
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
        let URL = `${apiURL}${directory}/${file}`.replaceAll('//', "/").replace('http:/', 'http://');
        fileArray.push({
            id: fileInfo.id,
            name: fileInfo.name,
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
        let URL = `${apiURL}${directory}/${folder}`.replaceAll('//', "/").replace('http:/', 'http://');
        dirInfo.push({
            rarity: folder,
            URL: URL
        });
    }
    return dirInfo;
}