import Express from 'express'
const express = Express()

express.get("/datarouter/api/v1/public/data", async (req, res) => {
    res.status(200).end();
})

export default express