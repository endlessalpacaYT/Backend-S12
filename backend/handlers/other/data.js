import Express from 'express'
const express = Express();

express.get("/content/api/pages/fortnite-game", async (_, res) => {
    const c = JSON.parse(JSON.stringify(require("../../local/handlers/c.json")));
    
    res.json(c)
});

export default express