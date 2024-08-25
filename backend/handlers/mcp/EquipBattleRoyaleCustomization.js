import Express from "express";
const express = Express();
import Profile from "../../database/models/profiles.js";
import { getUser } from "../../functions/functions/functions.js";

express.post(
    "/fortnite/api/game/v2/profile/*/client/EquipBattleRoyaleCustomization",
    getUser,
    async (req, res) => {
        try {
            const { itemToSlot, slotName, indexWithinSlot, variantUpdates } =
                req.body;

            const profile = await Profile.findOne({ accountId: req.user.accountId });

            if (!profile) {
                return res.status(404).json({ error: "Profile not found" });
            }

            let profileChanges = [];

            if (
                !isValidInput(itemToSlot, slotName, indexWithinSlot, variantUpdates)
            ) {
                return res.status(400).json({ error: "Invalid request" });
            }

            applyCustomization(
                req.user.accountId,
                itemToSlot,
                slotName,
                indexWithinSlot,
                variantUpdates,
                req,
                profileChanges
            );

            await updateProfile(req.user.accountId, req.query.profileId);

            let athena = profile?.profiles[req.query.profileId];
            athena.rvn += 1;
            athena.commandRevision += 1;
            athena.updated = new Date().toISOString();

            res.json({
                profileRevision: profile.profiles.athena.rvn || 0,
                profileId: req.query.profileId,
                profileChangesBaseRevision: profile.rvn,
                profileChanges: profileChanges,
                profileCommandRevision: profile.commandRevision || 0,
                serverTime: new Date().toISOString(),
                responseVersion: 1,
            });
        } catch (error) {
            console.error(error);
        }
    }
);

function isValidInput(itemToSlot, slotName, indexWithinSlot, variantUpdates) {
    if (typeof itemToSlot !== "string" || typeof slotName !== "string") {
        return false;
    }
    if (
        slotName === "ItemWrap" &&
        (typeof indexWithinSlot !== "number" ||
            indexWithinSlot < -1 ||
            indexWithinSlot > 7)
    ) {
        return false;
    }
    return true;
}

async function applyCustomization(
    accountId,
    itemToSlot,
    slotName,
    indexWithinSlot,
    variantUpdates,
    req,
    profileChanges
) {
    const profile = await Profile.findOne({ accountId: accountId });
    if (
        !profile.profiles.athena.items["athena-loadout"].attributes
            .locker_slots_data.slots[slotName]
    ) {
        return;
    }
    let activeLoadout =
        profile.profiles.athena.stats.attributes.loadouts[
            profile.profiles.athena.stats.attributes.active_loadout_index
        ];

    if (profile.profiles.athena.items[req.body.itemToSlot]) {
        if (Array.isArray(req.body.variantUpdates)) {
            for (let i in req.body.variantUpdates) {
                if (typeof req.body.variantUpdates[i] != "object") continue;
                if (!req.body.variantUpdates[i].channel) continue;
                if (!req.body.variantUpdates[i].active) continue;

                let item = profile.profiles.athena.items[req.body.itemToSlot];
                let index = item.attributes.variants.findIndex(
                    (x) => x.channel == req.body.variantUpdates[i].channel
                );

                if (index == -1) {
                    item.attributes.variants.push({
                        channel: req.body.variantUpdates[i].channel,
                        active: req.body.variantUpdates[i].active,
                        owned: req.body.variantUpdates[i].owned,
                    });
                } else {
                    item.attributes.variants[index].active =
                        req.body.variantUpdates[i].active;
                }
            }

            profileChanges.push({
                changeType: "itemAttrChanged",
                itemId: req.body.itemToSlot,
                attributeName: "variants",
                attributeValue:
                    profile.profiles.athena.items[req.body.itemToSlot].attributes
                        .variants,
            });
        }

        switch (slotName) {
            case "Dance":
                if (
                    !profile.profiles.athena.items[activeLoadout].attributes
                        .locker_slots_data.slots[req.body.slotName]
                )
                    break;

                if (req.body.indexWithinSlot >= 0 && req.body.indexWithinSlot <= 6) {
                    profile.profiles.athena.stats.attributes.favorite_dance[
                        req.body.indexWithinSlot
                    ] = req.body.itemToSlot;
                    profile.profiles.athena.items[
                        activeLoadout
                    ].attributes.locker_slots_data.slots.Dance.items[
                        req.body.indexWithinSlot
                    ] = profile.profiles.athena.items[itemToSlot].templateId;
                    profileChanges.push({
                        changeType: "statModified",
                        name: "favorite_dance",
                        value: profile.profiles.athena.stats.attributes["favorite_dance"],
                    });
                    profile.markModified("profiles");
                    await profile.save();
                }
                break;

            case "ItemWrap":
                if (indexWithinSlot === -1) {
                    for (let i = 0; i < 7; i++) {
                        profile.profiles.athena.stats.attributes.favorite_itemwraps[i] =
                            itemToSlot;
                        profile.profiles.athena.items[
                            activeLoadout
                        ].attributes.locker_slots_data.slots[slotName].items[i] =
                            profile.profiles.athena.items[itemToSlot].templateId;
                    }
                } else if (indexWithinSlot >= 0 && indexWithinSlot <= 7) {
                    profile.profiles.athena.stats.attributes.favorite_itemwraps[
                        indexWithinSlot
                    ] = itemToSlot;
                    profile.profiles.athena.items[
                        activeLoadout
                    ].attributes.locker_slots_data.slots[slotName].items[
                        indexWithinSlot
                    ] = profile.profiles.athena.items[itemToSlot].templateId;
                }
                profileChanges.push({
                    changeType: "statModified",
                    name: "favorite_itemwraps",
                    value: profile.profiles.athena.stats.attributes.favorite_itemwraps,
                });
                profile.markModified("profiles");
                await profile.save();
                break;

            default:
                if (
                    ![
                        "Character",
                        "Backpack",
                        "Pickaxe",
                        "Glider",
                        "SkyDiveContrail",
                        "MusicPack",
                        "LoadingScreen",
                    ].includes(slotName)
                ) {
                    return;
                }
                profile.profiles.athena.stats.attributes[
                    `favorite_${slotName.toLowerCase()}`
                ] = itemToSlot;
                profile.profiles.athena.items[
                    activeLoadout
                ].attributes.locker_slots_data.slots[slotName].items = [
                    profile.profiles.athena.items[itemToSlot].templateId,
                ];
                profileChanges.push({
                    changeType: "statModified",
                    name: `favorite_${slotName.toLowerCase()}`,
                    value:
                        profile.profiles.athena.stats.attributes[
                            `favorite_${slotName.toLowerCase()}`
                        ],
                });
                profile.markModified("profiles");
                await profile.save();
                break;
        }
    }
}

async function updateProfile(accountId, queryProfileId) {
    const profiles = await Profile.findOne({ accountId: accountId });
    let athena = profiles?.profiles[queryProfileId];
    athena.rvn += 1;
    athena.commandRevision += 1;
    athena.updated = new Date().toISOString();
}

export default express;
