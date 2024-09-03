const functions = require("../structure/functions.js");


module.exports = async (wss) => {
  // create hashes
  const ticketId = functions.MakeID().replace(/-/gi, "");
  const matchId = functions.MakeID().replace(/-/gi, "");
  const sessionId = functions.MakeID().replace(/-/gi, "");

  Connecting();
  await functions.sleep(800);
  Waiting();
  await functions.sleep(1000);
  Queued();
  await functions.sleep(4000);
  SessionAssignment();
  await functions.sleep(2000);
  Join();

  function Connecting() {
    wss.send(
      JSON.stringify({
        payload: {
          state: "Connecting",
        },
        name: "StatusUpdate",
      })
    );
  }

  function Waiting() {
    wss.send(
      JSON.stringify({
        payload: {
          totalPlayers: 1,
          connectedPlayers: 1,
          state: "Waiting",
        },
        name: "StatusUpdate",
      })
    );
  }

  function Queued() {
    wss.send(
      JSON.stringify({
        payload: {
          ticketId: ticketId,
          queuedPlayers: 0,
          estimatedWaitSec: 0,
          status: {},
          state: "Queued",
        },
        name: "StatusUpdate",
      })
    );
  }

  function SessionAssignment() {
    wss.send(
      JSON.stringify({
        payload: {
          matchId: matchId,
          state: "SessionAssignment",
        },
        name: "StatusUpdate",
      })
    );
  }

  function Join() {
    wss.send(
      JSON.stringify({
        payload: {
          matchId: matchId,
          sessionId: sessionId,
          joinDelaySec: 1,
        },
        name: "Play",
      })
    );
  }
};
