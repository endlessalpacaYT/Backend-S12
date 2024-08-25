import Express from 'express'
const express = Express();
import Profile from '../../database/models/profiles.js'
import { getVersion } from '../../functions/functions/functions';

express.post("/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin", async (req, res) => {
    var profiles = await Profile.findOne({ accountId: req.params.accountId });
    let profile = profiles.profiles[req.query.profileId];
    var QuestIDS = JSON.parse(JSON.stringify(require("../../local/quests.json")));
    const ver = getVersion(req);

    var profileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var QuestCount = 0;
    var ShouldGiveQuest = true;
    var DateFormat = (new Date().toISOString()).split("T")[0];
    var DailyQuestIDS;
    var SeasonQuestIDS;

    try {
        if (req.query.profileId == "profile0" || req.query.profileId == "campaign") {
            DailyQuestIDS = QuestIDS.SaveTheWorld.Daily

            if (QuestIDS.SaveTheWorld.hasOwnProperty(`Season${ver.season}`)) {
                SeasonQuestIDS = QuestIDS.SaveTheWorld[`Season${ver.season}`]
            }

            for (var key in profile.items) {
                if (profile.items[key].templateId.toLowerCase().startsWith("quest:daily")) {
                    QuestCount += 1;
                }
            }

            var QuestsToGrant = [
                "Quest:foundersquest_getrewards_0_1",
                "Quest:foundersquest_getrewards_1_2",
                "Quest:foundersquest_getrewards_2_3",
                "Quest:foundersquest_getrewards_3_4",
                "Quest:foundersquest_chooseherobundle",
                "Quest:foundersquest_getrewards_4_5",
                "Quest:foundersquest_herobundle_nochoice"
            ]

            for (var i in QuestsToGrant) {
                var bSkipThisQuest = false;
                for (var key in profile.items) {
                    if (profile.items[key].templateId.toLowerCase() == QuestsToGrant[i].toLowerCase()) {
                        bSkipThisQuest = true;
                    }
                }
                if (bSkipThisQuest == true) {
                    continue;
                }

                var ItemID = functions.MakeID();
                var Item = {
                    "templateId": QuestsToGrant[i],
                    "attributes": {
                        "creation_time": "min",
                        "quest_state": "Completed",
                        "last_state_change_time": new Date().toISOString(),
                        "level": -1,
                        "sent_new_notification": true,
                        "quest_rarity": "uncommon",
                        "xp_reward_scalar": 1
                    },
                    "quantity": 1
                }
                profile.items[ItemID] = Item
                profileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": ItemID,
                    "item": Item
                })
            }
        }

        if (profile.stats.attributes.hasOwnProperty("quest_manager")) {
            if (profile.stats.attributes.quest_manager.hasOwnProperty("dailyLoginInterval")) {
                if (profile.stats.attributes.quest_manager.dailyLoginInterval.includes("T")) {
                    var DailyLoginDate = (profile.stats.attributes.quest_manager.dailyLoginInterval).split("T")[0];

                    if (DailyLoginDate == DateFormat) {
                        ShouldGiveQuest = false;
                    } else {
                        ShouldGiveQuest = true;
                        if (profile.stats.attributes.quest_manager.dailyQuestRerolls <= 0) {
                            profile.stats.attributes.quest_manager.dailyQuestRerolls += 1;
                        }
                    }
                }
            }
        }

        if (QuestCount < 3 && ShouldGiveQuest == true) {
            const NewQuestID = functions.MakeID();
            var randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

            for (var key in profile.items) {
                while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
                    randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
                }
            }

            profile.items[NewQuestID] = {
                "templateId": DailyQuestIDS[randomNumber].templateId,
                "attributes": {
                    "creation_time": new Date().toISOString(),
                    "level": -1,
                    "item_seen": false,
                    "playlists": [],
                    "sent_new_notification": false,
                    "challenge_bundle_id": "",
                    "xp_reward_scalar": 1,
                    "challenge_linked_quest_given": "",
                    "quest_pool": "",
                    "quest_state": "Active",
                    "bucket": "",
                    "last_state_change_time": new Date().toISOString(),
                    "challenge_linked_quest_parent": "",
                    "max_level_bonus": 0,
                    "xp": 0,
                    "quest_rarity": "uncommon",
                    "favorite": false
                },
                "quantity": 1
            };

            for (var i in DailyQuestIDS[randomNumber].objectives) {
                profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0
            }

            profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();

            profileChanges.push({
                "changeType": "itemAdded",
                "itemId": NewQuestID,
                "item": profile.items[NewQuestID]
            })

            profileChanges.push({
                "changeType": "statModified",
                "name": "quest_manager",
                "value": profile.stats.attributes.quest_manager
            })
        }
    } catch (err) {
    }

    for (var key in profile.items) {
        if (key.split("")[0] == "S" && (Number.isInteger(Number(key.split("")[1]))) && (key.split("")[2] == "-" || (Number.isInteger(Number(key.split("")[2])) && key.split("")[3] == "-"))) {
            if (!key.startsWith(`S${ver.season}-`)) {
                delete profile.items[key];

                profileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": key
                })
            }
        }
    }

    if (SeasonQuestIDS) {
        for (var Quest in SeasonQuestIDS.Quests) {
            if (profile.items.hasOwnProperty(Quest.itemGuid)) {
                profileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": Quest.itemGuid
                })
            }

            Quest = SeasonQuestIDS.Quests[Quest];

            profile.items[Quest.itemGuid] = {
                "templateId": Quest.templateId,
                "attributes": {
                    "creation_time": new Date().toISOString(),
                    "level": -1,
                    "item_seen": true,
                    "playlists": [],
                    "sent_new_notification": true,
                    "challenge_bundle_id": Quest.challenge_bundle_id || "",
                    "xp_reward_scalar": 1,
                    "challenge_linked_quest_given": "",
                    "quest_pool": "",
                    "quest_state": "Active",
                    "bucket": "",
                    "last_state_change_time": new Date().toISOString(),
                    "challenge_linked_quest_parent": "",
                    "max_level_bonus": 0,
                    "xp": 0,
                    "quest_rarity": "uncommon",
                    "favorite": false
                },
                "quantity": 1
            }

            for (var i in Quest.objectives) {
                profile.items[Quest.itemGuid].attributes[`completion_${Quest.objectives[i].name.toLowerCase()}`] = 0;
            }

            profileChanges.push({
                "changeType": "itemAdded",
                "itemId": Quest.itemGuid,
                "item": profile.items[Quest.itemGuid]
            })
        }
    }

    if (profileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        
        profiles.markModified('profiles')
        profiles.save();
    }

    if (QueryRevision != BaseRevision) {
        profileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": profileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});


export default express