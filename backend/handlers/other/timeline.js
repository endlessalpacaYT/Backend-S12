import Express from 'express'
const express = Express();
import { getVersion } from '../../functions/functions/functions.js'

express.get("/fortnite/api/calendar/v1/timeline", async (req ,res) => {
    const ver = getVersion(req);

    let activeEvents = [
        {
            "eventType": `EventFlag.Season${ver.season}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": `EventFlag.${ver.lobby}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        }
    ];

    res.json({
        channels: {
            "client-matchmaking": {
                states: [],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            },
            "client-events": {
                states: [{
                    validFrom: "0001-01-01T00:00:00.000Z",
                    activeEvents: activeEvents,
                    state: {
                        activeStorefronts: [],
                        eventNamedWeights: {},
                        seasonNumber: ver.season,
                        seasonTemplateId: `AthenaSeason:athenaseason${ver.season}`,
                        matchXpBonusPoints: 0,
                        seasonBegin: "2020-01-01T00:00:00Z",
                        seasonEnd: "9999-01-01T00:00:00Z",
                        seasonDisplayedEnd: "9999-01-01T00:00:00Z",
                        weeklyStoreEnd: "9999-01-01T00:00:00Z",
                        stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                        stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                        sectionStoreEnds: {
                            Featured: "9999-01-01T00:00:00.000Z"
                        },
                        dailyStoreEnd: "9999-01-01T00:00:00Z"
                    }
                }],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString()
    });
});

export default express