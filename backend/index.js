import Express from "express"
const express = Express();
import mongoose from "mongoose"
import dotenv from 'dotenv'
import { pathToFileURL } from 'url';
import path from 'path'
import fs from 'fs'
import bodyParser from "body-parser";
import log from './functions/structs/log.js'
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '..', "config", ".env") });

var cache = {};
var cacheMap = {};
mongoose.Query.prototype._origExec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.exec = async function () {
    if (!cacheMap[this.model.modelName]) cacheMap[this.model.modelName] = {};
    if (!cache[this.model.modelName]) cache[this.model.modelName] = {};
    var query = this.getQuery();
    var doc;
    if (!cacheMap[this.model.modelName][JSON.stringify(query)] && !query._id) {
        doc = await this._origExec();
        if (!doc) return null;
        var id = doc._id;
        cacheMap[this.model.modelName][JSON.stringify(query)] = id;
        cache[this.model.modelName][id] = doc;
    } else {
        var id = query._id ? query._id : cacheMap[this.model.modelName][JSON.stringify(query)];
        doc = cache[this.model.modelName][id];
        if (!doc) return null;
    }
    if (this.op == "updateOne" || this.op == "findOneAndUpdate") {
        var upd = this.getUpdate();
        for (var key of Object.keys(upd)) {

            if (!key.startsWith("$")) {
                eval(`doc.${key} = upd["${key}"]`);
            } else if (key == "$set") {
                for (var k2 of Object.keys(upd["$set"])) {
                    eval(`doc.${k2} = upd["$set"]["${k2}"]`);
                }
            } else if (key == "$inc") {
                for (var k2 of Object.keys(upd["$inc"])) {
                    eval(`doc.${k2} = upd["$inc"]["${k2}"]`);
                }
            }
        }
    }
    return doc;
}
mongoose.Query.prototype.saveFromCache = async function () {
    if (!cacheMap[this.model.modelName]) return null;
    var query = this.getQuery();
    var id = query._id ? query._id : cacheMap[this.model.modelName][JSON.stringify(query)];
    if (!id) id = (await this.model.findOne(query))._id;
    if (!id) return null;
    var doc = cache[this.model.modelName][id];
    if (!doc) return null;
    await (await this.model.findOne(query)).replaceOne(doc); 
}

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/BackendS12")

const PORT = 443
express.set("trust proxy", true);
express.use(Express.json());
express.use(bodyParser.json());
express.use(Express.urlencoded({ extended: true }));

async function loadHandlers(dir) {
    fs.readdirSync(dir).forEach(async (file) => {
        const absolutePath = path.join(dir, file);
        if (fs.statSync(absolutePath).isDirectory()) {
            await loadHandlers(absolutePath);
        } else if (file.endsWith(".js")) {
            const service = await import(pathToFileURL(absolutePath));
            express.use(service.default);
        }
    });
}

loadHandlers(path.join("backend/handlers"));

express.get("/", async (_, res) => {
    res.send("Hello Nerds!")
});

express.use((req, res, next) => {
    const logMessage = `${req.method} ${req.originalUrl}`;
    log.backend(logMessage);
    next();
});



express.listen(PORT, () => {
    log.backend("started")
});
