const express = require("express");
const app = express.Router();
const User = require("../Models/user.js")

app.get("/account/api/public/account", async (req, res) => {
    let response = [];

    if (typeof req.query.accountId == "string") {
        let user = await User.findOne({ accountId: req.query.accountId, banned: false }).lean();

        if (user) {
            response.push({
                id: user.accountId,
                displayName: user.username
            });
        }
    }

    if (Array.isArray(req.query.accountId)) {
        let users = await User.find({ accountId: { $in: req.query.accountId }, banned: false }).lean();

        if (users) {
            for (let user of users) {
                if (response.length >= 100) break;
                
                response.push({
                    id: user.accountId,
                    displayName: user.username
                });
            }
        }
    }

    res.json(response);
});

module.exports = app;

//god damn i dont know what i am doing ughhhhh!!!