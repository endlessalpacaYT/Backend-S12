const express = require('express');
const User = require('../Models/user.js');

const app = express();
const verboseLogging = process.env.VERBOSE_LOGGING;

console.log("api started!")

app.get('/version', (req, res) => {
    res.send({
            version: '0.11',
            backend: 'Backend S12'
            });
    if (verboseLogging == "true") {
        console.log('Request made to /version');
    }
  });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and Password are required.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Email.' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.json({ success: true, message: 'Login successful', username: user.username, discordId });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Password.' });
        }
    } catch (error) {
        if (verboseLogging == "true") {
            console.error('Error during login of user ', user.username, ':', error);
        }
        
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});

module.exports = app;
