const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const mongoose = require("mongoose");

const verboseLogging = process.env.VERBOSE_LOGGING;

if (verboseLogging == "false") {
    console.log("Verbose Logging: Off");
}else {
    console.log("Verbose Logging Is On (This Is Good For Debugging)");
}

express.use(Express.json());
express.use(Express.urlencoded({ extended: true }));
express.use(Express.static('public'));
express.use(cookieParser());

express.use(require("./structure/party.js"));
express.use(require("./structure/discovery.js"));
express.use(require("./structure/privacy.js"));
express.use(require("./structure/timeline.js"));
express.use(require("./structure/user.js"));
express.use(require("./structure/contentpages.js"));
express.use(require("./structure/friends.js"));
express.use(require("./structure/main.js"));
express.use(require("./structure/storefront.js"));
express.use(require("./structure/version.js"));
express.use(require("./structure/lightswitch.js"));
express.use(require("./structure/affiliate.js"));
express.use(require("./matchmaker/matchmaking.js"));
express.use(require("./structure/cloudstorage.js"));
express.use(require("./api/api.js"));

fs.readdirSync("./routes").forEach(fileName => {
    express.use(require(`./routes/${fileName}`));
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startBot() {
    if (verboseLogging == "true") {
        console.log("Discord Integration Is Starting!");
    }
    delay(500);
    require("./discord/index.js");
}

function startHttpServer() {
    const port = process.env.PORT || 3551;
    express.listen(port, () => {
        console.log(`Backend S12 Started On 127.0.0.1:${port}`);
    }).on("error", (err) => {
        if (err.code == "EADDRINUSE") console.log(`\x1b[31mERROR\x1b[0m: Port ${port} is already in use!`);
        else throw err; 
    });
}

try {
    if (!fs.existsSync(path.join(process.env.LOCALAPPDATA, "BackendS12"))) fs.mkdirSync(path.join(process.env.LOCALAPPDATA, "BackendS12"));
} catch (err) {
    // fallback
    if (!fs.existsSync(path.join(__dirname, "ClientSettings"))) fs.mkdirSync(path.join(__dirname, "ClientSettings"));
}

// if endpoint not found, return this error
express.use((req, res, next) => {
    var XEpicErrorName = "errors.com.epicgames.common.not_found";
    var XEpicErrorCode = 1004;

    res.set({
        'X-Epic-Error-Name': XEpicErrorName,
        'X-Epic-Error-Code': XEpicErrorCode
    });

    res.status(404);
    res.json({
        "errorCode": XEpicErrorName,
        "errorMessage": "Sorry the resource you were trying to find could not be found",
        "numericErrorCode": XEpicErrorCode,
        "originatingService": "any",
        "intent": "prod"
    });
});

async function initDB() {
    const DB = process.env.DB;
    if (verboseLogging == "true") {
        console.log("MongoDB Connecting To: " + DB);
    }
    try {
        await mongoose.connect(DB);
        console.log("MongoDB Connected To: " + DB);

        const testSchema = new mongoose.Schema({
            username: { type: String, required: true }
        }, { timestamps: true });

        const TestModel = mongoose.model('Test', testSchema);

        const testDoc = new TestModel({
            username: "Test"
        });

        const savedDoc = await testDoc.save();
        if (verboseLogging == "true") {
            console.log("Test Document Saved: ", savedDoc);
        }

    } catch (err) {
        console.log("ERR: Could Not Connect To DB or Save Document! : ", err);
    }
}

/* Function to start backend,
I want to create a way to restart backend in future using frontend so this might come in handy*/

function startBackend() {
    console.log("Starting Backend!");
    startHttpServer();
    initDB();
    require("./xmpp/xmpp.js");
    delay(100);
    startBot();
}

startBackend();