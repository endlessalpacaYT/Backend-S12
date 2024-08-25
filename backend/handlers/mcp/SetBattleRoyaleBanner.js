import Express from 'express'
import Profiles from '../../database/models/profiles.js';
const express = Express();

express.post("/fortnite/api/game/v2/profile/:accountId/client/SetBattleRoyaleBanner", async (req, res) => {
    const accountId = req.params.accountId
    const profiles = await Profiles.findOne({ accountId: accountId })

    let profileChanges = [];

    try {
        profiles.profiles.athena.stats.attributes.banner_icon = req.body.homebaseBannerIconId;
        profiles.profiles.athena.stats.attributes.banner_color = req.body.homebaseBannerColorId;

        profileChanges.push({
            "changeType": "statModified",
            "name": "banner_icon",
            "value": profiles.profiles.athena.stats.attributes.banner_icon
        });

        profileChanges.push({
            "changeType": "statModified",
            "name": "banner_color",
            "value": profiles.profiles.athena.stats.attributes.banner_color
        });

        profiles.markModified('profiles')
        await updateProfile(req.params.accountId, req.query.profileId);

        await profiles.save();
        res.json({
            profileRevision: profiles.profiles.athena.rvn || 0,
            profileId: req.query.profileId,
            profileChangesBaseRevision: profiles.profiles.athena.rvn,
            profileChanges: profileChanges,
            profileCommandRevision: profiles.profiles.athena.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    } catch (error) {
        console.error(error)
        console.log(req.body)
    }
});

async function updateProfile(accountId, queryProfileId) {
    const profiles = await Profiles.findOne({ accountId: accountId });
    let athena = profiles?.profiles[queryProfileId];
    athena.rvn += 1;
    athena.commandRevision += 1;
    athena.updated = new Date().toISOString();
}

export default express