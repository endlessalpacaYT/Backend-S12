import Express from 'express'
import fs from 'fs'
const express = Express()

express.get("/fortnite/api/storefront/v2/keychain", async (req, res) => {
    const keychain = fs.readFileSync("src/local/keychain.json", 'utf8');
    res.json(JSON.parse(keychain));
});

export default express