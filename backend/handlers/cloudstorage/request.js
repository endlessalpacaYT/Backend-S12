import Express from 'express'
const express = Express();

express.post("/fortnite/api/matchmaking/session/matchMakingRequest", async (req, res) => {
    res.json([])
});

export default express