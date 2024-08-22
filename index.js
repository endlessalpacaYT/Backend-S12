const express = require("express");

const app = express();
const port = 3551;

app.get("/", (req, res) => {
    res.send("Backend S12 Is Running");
});

app.listen(port, () => {
    console.log(`Backend S12 Is Listening On Port ${port}`);
});
