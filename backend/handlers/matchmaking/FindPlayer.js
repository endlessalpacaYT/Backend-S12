import Express from 'express'
const express = Express()

express.get("/fortnite/api/matchmaking/session/findPlayer/*", async (req, res) => {
    res.status(200).end()
});

export default express