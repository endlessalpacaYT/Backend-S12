import Express from 'express';
import User from '../../database/models/user.js';
import Profile from '../../database/models/profiles.js';
import { getVersion } from '../../functions/functions/functions.js'

const express = Express();

express.post("/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform", async (req, res) => {
    try {
        const ver = getVersion;
        var profiles = await Profile.findOne({ accountId: req.params.accountId });
        let profile = profiles.profiles[req.query.profileId];
        if (profile.rvn == profile.commandRevision) {
            profile.rvn += 1;
            await profiles?.updateOne({
                $set: { [`profiles.${req.query.profileId}`]: profile },
            });
        }
        let MultiUpdate = [];
        let profileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = ver.build >= 12.2 ? profile.commandRevision : profile.rvn;
      let QueryRevision = req.query.rvn || -1;
        if (QueryRevision != ProfileRevisionCheck) {
            profileChanges = [
              {
                changeType: "fullProfileUpdate",
                profile: profile,
              },
            ];
          }
          profileChanges = [
            {
              changeType: "fullProfileUpdate",
              profile: profile,
            },
          ];
        res.json({
            profileRevision: profile.rvn || 0,
            profileId: req.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1,
        });
    } catch (error) {
        console.error(error)
    }
});

export default express;
