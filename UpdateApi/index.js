const express = require("express");

const app = express();
const ip = "127.0.0.1";
const port = 5555;

const version = "0.13.13";
const latestVersion = version;
const versionPath = "./" + latestVersion;

app.get("/api/currentversion", (req, res) => {
    res.send({
        version: latestVersion,
        versionDate: '05/09/2024',
        backend: 'Backend S12',
        path: versionPath
    });
});

app.listen(port, ip, () => {
    console.log(`The API is running on ${ip}:${port}`);
})