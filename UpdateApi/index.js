const express = require("express");
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const ip = process.env.IP || "127.0.0.1";
const port = process.env.PORT || 5555;

const version = process.env.VERSION || "VERSION DOES NOT EXIST!";
const latestVersion = version;
const updatesDirectory = path.join(__dirname, 'updates');

app.get("/api/currentversion", (req, res) => {
    res.send({
        version: latestVersion,
        versionDate: '05/09/2024',
        backend: 'Backend S12',
        path: `/api/update/${latestVersion}`
    });
});

app.listen(port, ip, () => {
    console.log(`The API is running on ${ip}:${port}`);
})