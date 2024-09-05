const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Check for updates for the backend!"),

    async execute(interaction) {
        try {
            let response = await axios.get("http://" + process.env.UPDATE_API_IP + ":" + process.env.UPDATE_API_PORT + "/api/currentversion");

            const newBackendVersionInfo = response.data.version; 
            const newBackendName = response.data.backend;
            const newVersionDate = response.data.versionDate;

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
