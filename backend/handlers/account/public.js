import Express from "express";
const express = Express();
import User from "../../database/models/user.js";

express.get("/account/api/public/account/:accountId", async (req, res) => {
  var user = await User.findOne({ accountId: req.params.accountId });
  let response = {
    id: user.accountId,
    displayName: user.displayName,
    externalAuths: {},
  };
  res.json(response);
});

express.get("/account/api/public/account", async (req, res) => {
  var response = [];

  if (typeof req.query.accountId == "string") {
    let user = await User.findOne({
      accountId: req.query.accountId,
    }).lean();
    if (user) {
      response.push({
        id: user.accountId,
        displayName: user.displayName,
        externalAuths: {},
      });
    }
  } else if (Array.isArray(req.query.accountId)) {
    let users = await User.find({
      accountId: { $in: req.query.accountId },
    }).lean();
    if (users) {
      for (let user of users) {
        if (response.length >= 100) break;
        response.push({
          id: user.accountId,
          displayName: user.displayName,
          externalAuths: {},
        });
      }
    }
  }
  res.json(response);
});

express.get(
  "/account/api/public/account/:accountId/externalAuths",
  async (req, res) => {
    res.status(204);
    res.json({});
  }
);

export default express;
