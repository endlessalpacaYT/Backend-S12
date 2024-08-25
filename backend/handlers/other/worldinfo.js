import Express from 'express'
import fs from 'fs'
import path from 'path'
const express = Express()
import { getVersion } from '../../functions/functions/functions.js';

express.get("/fortnite/api/game/v2/world/info", async (req, res) => {
    const ver = getVersion
    const rawData = fs.readFileSync("src/local/worldstw.json");
    var theater = JSON.stringify(JSON.parse(rawData));
    var Season = "Season" + ver.season;

    if (ver.build >= 15.3) {
        theater = theater.replace(/\/Game\//gi, "/SaveTheWorld/");
        theater = theater.replace(
            /\"DataTable\'\/SaveTheWorld\//gi,
            "\"DataTable'/Game/"
        );
    }

    var date = new Date();
    var hour = date.getHours();

    if (ver.season >= 9) {
        date.setHours(23, 59, 59, 999);
    } else {
        if (hour < 6) {
            date.setHours(5, 59, 59, 999);
        } else if (hour < 12) {
            date.setHours(11, 59, 59, 999);
        } else if (hour < 18) {
            date.setHours(17, 59, 59, 999);
        } else {
            date.setHours(23, 59, 59, 999);
        }
    }

    date = date.toISOString();

    theater = theater.replace(/2017-07-25T23:59:59.999Z/gi, date);

    theater = JSON.parse(theater);

    if (theater.hasOwnProperty("Seasonal")) {
        if (theater.Seasonal.hasOwnProperty(Season)) {
            theater.theaters = theater.theaters.concat(
                theater.Seasonal[Season].theaters
            );
            theater.missions = theater.missions.concat(
                theater.Seasonal[Season].missions
            );
            theater.missionAlerts = theater.missionAlerts.concat(
                theater.Seasonal[Season].missionAlerts
            );
        }
        delete theater.Seasonal;
    }

    res.json(theater); 
});

export default express