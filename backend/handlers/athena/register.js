import Express from 'express'
import { CreateId, registerUser } from '../../functions/functions/functions.js';
import User from '../../database/models/user.js'

const express = Express()

express.get("/register", async (req, res) => {
    const { username, email, password } = req.query;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send("An account already exists with this email");
        }

        try {
            const result = await registerUser(username, email, password);

            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            console.error("Error registering user:", error);
            return res.status(500).json({ message: "An error occurred while registering user" });
        }
    } catch (error) {
        console.error(error)
    }
 });

export default express