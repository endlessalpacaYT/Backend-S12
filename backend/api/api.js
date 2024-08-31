const express = require('express');

const app = express();
const verboseLogging = process.env.VERBOSE_LOGGING;

app.get('/version', (req, res) => {
    res.send({ version: '0.1'});
    if (verboseLogging == "true") {
        console.log('Request made to /version');
    }
  });
