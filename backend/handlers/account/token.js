import Express from 'express'
const express = Express()
import User from '../../database/models/user.js'
import jwt from 'jsonwebtoken'
import { CreateId, decode64, getUser } from '../../functions/functions/functions.js';

global.accessTokens = [];
global.refreshTokens = [];

express.post("/account/api/oauth/token", async (req, res) => {
    if (req.body.grant_type == "password") {
        const deviceId = CreateId();
        var clientId = decode64((req.headers["authorization"] ?? "").split(" ")[1]).split(":");
        const user = await User.findOne({ email: req.body.username });

        var t = jwt.sign(
            JSON.stringify({
                email: req.body.username,
                password: req.body.password,
                type: "access",
            }),
            "verySecretKey"
        );
        var r = jwt.sign(
            JSON.stringify({
                email: req.body.username,
                password: req.body.password,
                type: "refresh",
            }),
            "verySecretKey"
        );

        global.accessTokens.push(t);
        global.refreshTokens.push(r);
        res.json({
            access_token: t,
            expires_in: 28800,
            expires_at: "9999-12-02T01:12:01.100Z",
            token_type: "bearer",
            refresh_token: r,
            refresh_expires: 86400,
            refresh_expires_at: "9999-12-02T01:12:01.100Z",
            account_id: user.accountId,
            client_id: clientId,
            internal_client: true,
            client_service: "fortnite",
            displayName: req.body.username,
            app: "fortnite",
            in_app_id: user.accountId,
            device_id: deviceId,
        });
    } else if (req.body.grant_type == "client_credentials") {
        res.json({
            access_token: jwt.sign(CreateId(), "verySecretKey"),
            expires_in: 28800,
            expires_at: "9999-12-02T01:12:01.100Z",
            token_type: "bearer",
            client_id: clientId,
            internal_client: true,
            client_service: "fortnite",
        });
    } else if (req.body.grant_type == "refresh_token") {
        const deviceId = CreateId();
        const decodedToken = jwt.decode(req.body.refresh_token);
        req.user = await User.findOne({ email: decodedToken.email });
        if (!req.user || decodedToken.password != req.user.password) {
            return;
        }

        var t = jwt.sign(
            JSON.stringify({
                email: req.user.email,
                password: req.user.password,
                type: "access",
            }),
            "verySecretKey"
        );

        res.json({
            access_token: t,
            expires_in: 28800,
            expires_at: "9999-12-02T01:12:01.100Z",
            token_type: "bearer",
            refresh_token: req.body.refresh_token,
            refresh_expires: 86400,
            refresh_expires_at: "9999-12-02T01:12:01.100Z",
            account_id: req.user.accountId,
            client_id: clientId,
            internal_client: true,
            client_service: "fortnite",
            displayName: req.user.username,
            app: "fortnite",
            in_app_id: req.user.accountId,
            device_id: deviceId,
        });
    }
});

express.get("/account/api/oauth/verify", getUser, async (req, res) => {
      let token = req.headers["authorization"].replace("bearer ", "");
      const deviceId = CreateId();
  
      //unfinished
      res.json({
        token: token, //needs
        account_id: req.user.accountId,
        client_id: "Solaraclientid", //needs
        internal_client: true,
        client_service: "fortnite",
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        app: "fortnite",
        auth_method: "password", //needs
        device_id: deviceId,
        displayName: req.user.username,
        in_app_id: req.user.accountId,
      });
    }
  );

export default express