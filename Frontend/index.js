const express = require("express");
const path = require('path');
require('dotenv').config();

const app = express();
const ip = process.env.IP || "127.0.0.1";
const port = process.env.PORT || 80;

console.log("Frontend Started");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/main/index.html"));
});

try {
    app.listen(port, ip, () => {
        console.log(`Frontend Has Started On ${ip}:${port}`);
    });
}catch (err) {
    console.log("[ERROR] Frontend Could Not Be Started: " + err);
};