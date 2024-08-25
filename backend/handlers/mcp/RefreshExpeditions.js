import Express from 'express'
import Profile from '../../database/models/profiles.js'
const express = Express();

express.post("/fortnite/api/game/v2/profile/:accountId/client/RefreshExpeditions", async (req, res) => {
    var profiles = await Profile.findOne({ accountId: req.params.accountId });
    let profile = profiles.profiles[req.query.profileId];
    var expeditionData = require("../../local/expeditionData.json");

    var profileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var ExpeditionSlots = [];
    var date = new Date().toISOString();

    for (var key in profile.items) {
        var templateId = profile.items[key].templateId.toLowerCase();
        if (expeditionData.questsUnlockingSlots.includes(templateId)) {
            if (profile.items[key].attributes.quest_state == "Claimed") {
                ExpeditionSlots = ExpeditionSlots.concat(expeditionData.slotsFromQuests[templateId]);
            }
        }
    }

    for (var key in profile.items) {
        if (profile.items[key].templateId.toLowerCase().startsWith("expedition:")) {
            var expiration_end_time = new Date(profile.items[key].attributes.expedition_expiration_end_time).toISOString();
            if (date > expiration_end_time && !profile.items[key].attributes.hasOwnProperty("expedition_start_time")) {
                delete profile.items[key];

                profileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": key
                })

                StatChanged = true;
            } else { 
                var index = ExpeditionSlots.indexOf(profile.items[key].attributes.expedition_slot_id);
                if (index !== -1) {
                    ExpeditionSlots.splice(index, 1)
                }
            }
        }
    }
    for (var i = 0; i < ExpeditionSlots.length; i++) {
        var slot = ExpeditionSlots[i];

        var ExpeditionsToChoose = expeditionData.slots[slot];
        if (ExpeditionsToChoose.hasOwnProperty("rare") && Math.random() < 0.05) {
            ExpeditionsToChoose = ExpeditionsToChoose.rare;
        } else {
            ExpeditionsToChoose = ExpeditionsToChoose.normal;
        }

        var randomNumber = Math.floor(Math.random() * ExpeditionsToChoose.length);
        var ID = functions.MakeID();
        var templateId = ExpeditionsToChoose[randomNumber];

        var endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + expeditionData.attributes[templateId].expiration_duration_minutes);
        endDate = endDate.toISOString();

        var Item = {
            "templateId": templateId,
            "attributes": {
                "expedition_expiration_end_time": endDate,
                "expedition_criteria": [],
                "level": 1,
                "expedition_max_target_power": expeditionData.attributes[templateId].expedition_max_target_power,
                "expedition_min_target_power": expeditionData.attributes[templateId].expedition_min_target_power,
                "expedition_slot_id": slot,
                "expedition_expiration_start_time": date
            },
            "quantity": 1
        }

        for (var x = 0; x < 3; x++) {
            if (Math.random() < 0.2) { 
                randomNumber = Math.floor(Math.random() * expeditionData.criteria.length);
                Item.attributes.expedition_criteria.push(expeditionData.criteria[randomNumber])
            }
        }

        profile.items[ID] = Item;

        profileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": Item
        })
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.markModified('profiles')
        profile.save();
    }

    if (QueryRevision != BaseRevision) {
        profileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": profileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

export default express