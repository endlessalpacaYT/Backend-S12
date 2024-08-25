import Express from 'express'
import User from '../../database/models/user.js'
import Profile from '../../database/models/profiles.js'
const express = Express() // im sped NO SHIT S kys

express.get("/export/profile/:accountId", async (req ,res) => {
    var user = await User.findOne({ accountId: req.params.accountId }).lean();
    var profiles = await Profile.findOne({ accountId: req.params.accountId }).lean();

    const profile = {
        user: user,
        profiles: profiles
    }
    res.setHeader('Content-disposition', `attachment; filename=${req.params.accountId}.json`);
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(profile, null, 4))
});

export default express