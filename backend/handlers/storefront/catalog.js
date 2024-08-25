import Express from 'express'
const express = Express();
import catalog from '../../local/catalog.json'


express.get("/fortnite/api/storefront/v2/catalog", async (req, res) => {
    res.json(catalog)
});

export default express