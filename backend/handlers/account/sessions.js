import Express from 'express'
const express = Express()

express.delete("/account/api/oauth/sessions/kill", async (req, res) => {
    res.status(204).end();
});

export default express