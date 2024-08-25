import Express from 'express'
const express = Express()
import fs from 'fs'
import crypto from 'crypto'

express.get("/fortnite/api/cloudstorage/system", async (req, res) => {
    var csFiles = [];
    for (var file of fs.readdirSync("src/local/hotfixes")) {
        var f = fs.readFileSync("src/local/hotfixes/" + file).toString();
        csFiles.push({
            uniqueFilename: file,
            filename: file,
            hash: crypto.createHash("sha1").update(f).digest("hex"),
            hash256: crypto.createHash("sha256").update(f).digest("hex"),
            length: f.length,
            contentType: "application/octet-stream",
            uploaded: new Date().toISOString(),
            storageType: "S3",
            storageIds: {},
            doNotCache: true,
        });
    }
    res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/config", async (req, res) => {
    var csFiles = [];
    for (var file of fs.readdirSync("src/local/hotfixes")) {
        var f = fs.readFileSync("src/local/hotfixes/" + file).toString();
        csFiles.push({
            uniqueFilename: file,
            filename: file,
            hash: crypto.createHash("sha1").update(f).digest("hex"),
            hash256: crypto.createHash("sha256").update(f).digest("hex"),
            length: f.length,
            contentType: "application/octet-stream",
            uploaded: new Date().toISOString(),
            storageType: "S3",
            storageIds: {},
            doNotCache: true,
        });
    }
    res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/:file", async (req, res) => {
    res.send(
        fs.readFileSync("src/local/hotfixes/" + req.params.file).toString()
    );
});

export default express