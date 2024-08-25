import Express from 'express'
const express = Express()

express.get("/lightswitch/api/service/bulk/status", async (req, res) => {
    res.json([
        {
            serviceInstanceId: "fortnite",
            status: "UP",
            message: "fortnite is up.",
            maintenanceUri: null,
            overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
            allowedActions: ["PLAY", "DOWNLOAD"],
            banned: false,
            launcherInfoDTO: {
                appName: "Fortnite",
                catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
                namespace: "fn",
            },
        },
    ]);
});

express.get("/fortnite/api/game/v2/friendcodes/*/epic", async (req, res) => {
    res.json([])
});

express.post("/fortnite/api/game/v2/grant_access/*", async (req, res) => {
    res.json({});
    res.status(204);
});

express.get("/fortnite/api/game/v2/enabled_features", async (req, res) => {
    res.json([]);
});

export default express