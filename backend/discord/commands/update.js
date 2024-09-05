const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Check for updates for the backend!"),

    async execute(interaction) {
        try {
            let newBackendVersionInfo;
            let newBackendName;
            let newVersionDate;

            try {
                let response = await axios.get("http://" + process.env.UPDATE_API_IP + ":" + process.env.UPDATE_API_PORT + "/api/currentversion");

                newBackendVersionInfo = response.data.version; 
                newBackendName = response.data.backend;
                newVersionDate = response.data.versionDate;
            } 
            catch {
                console.log("[ERROR] Could not connect to update API, Reverting to Preset Configuration!");

                try {
                    let response = await axios.get("http://update.pongodev.com:5555/api/currentversion");

                    newBackendVersionInfo = response.data.version; 
                    newBackendName = response.data.backend;
                    newVersionDate = response.data.versionDate;
                } catch (error) {
                    console.log("[ERROR] Could not connect to the preset update API either!");
                    await interaction.reply({ content: 'Unable to check for updates. Please try again later.', ephemeral: true });
                    return;
                }
            }

            response = await axios.get("http://127.0.0.1:3551/version");

            const backendVersionInfo = response.data.version; 
            const backendName = response.data.backend;
            const versionDate = response.data.versionDate;

            let isUpdate
            
            if (newBackendVersionInfo !== backendVersionInfo || newBackendName !== backendName || newVersionDate !== versionDate) {
                isUpdate = true;
            } else {
                isUpdate = false;
            }

            if (isUpdate == true) {
                const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Update Status!")
                .setDescription("There is an update!");

                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("Update Status!")
                .setDescription("There is no updates available!");

                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error("Error executing command:", error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
