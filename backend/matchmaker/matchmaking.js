const express = require('express');
const router = express.Router();
const functions = require('../structure/functions.js');

router.get('/fortnite/api/matchmaking/session/findPlayer/*', async (req, res) => {
    res.sendStatus(200);
});

router.get('/fortnite/api/game/v2/matchmakingservice/ticket/player/*', async (req, res) => {
    const [bucketId] = req.query.bucketId.split(':');
    res.cookie('currentbuildUniqueId', bucketId);
    res.json({
        serviceUrl: 'wss://mm.optixyt.uk',
        ticketType: 'mms-player',
        payload: '69=',
        signature: '420='
    });
});

router.get('/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId', async (req, res) => {
    const { accountId, sessionId } = req.params;
    res.json({
        accountId,
        sessionId,
        key: 'AOJEv8uTFmUh7XM2328kq9rlAzeQ5xzWzPIiyKn2s7s='
    });
});

router.get('/fortnite/api/matchmaking/session/:session_id', async (req, res) => {
    const { session_id } = req.params;
    res.json({
        id: session_id,
        ownerId: functions.MakeID().replace(/-/g, '').toUpperCase(),
        ownerName: '[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968',
        serverName: '[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968',
        serverAddress: process.env.GS_IP,
        serverPort: process.env.GS_PORT,
        maxPublicPlayers: 220,
        openPublicPlayers: 175,
        maxPrivatePlayers: 0,
        openPrivatePlayers: 0,
        attributes: {
            REGION_s: 'EU',
            GAMEMODE_s: 'FORTATHENA',
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: 'GB',
            DCID_s: 'FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880',
            tenant_s: 'Fortnite',
            MATCHMAKINGPOOL_s: 'Any',
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: 'Playlist_DefaultSolo',
            SESSIONKEY_s: functions.MakeID().replace(/-/g, '').toUpperCase(),
            TENANT_s: 'Fortnite',
            BEACONPORT_i: 15009
        },
        publicPlayers: [],
        privatePlayers: [],
        totalPlayers: 45,
        allowJoinInProgress: false,
        shouldAdvertise: false,
        isDedicated: false,
        usesStats: false,
        allowInvites: false,
        usesPresence: false,
        allowJoinViaPresence: true,
        allowJoinViaPresenceFriendsOnly: false,
        buildUniqueId: req.cookies.currentbuildUniqueId || '0',
        lastUpdated: new Date().toISOString(),
        started: false
    });
});

router.post('/fortnite/api/matchmaking/session/*/join', async (req, res) => {
    res.sendStatus(204);
});

router.post('/fortnite/api/matchmaking/session/matchMakingRequest', async (req, res) => {
    res.json([]);
});

module.exports = router;
