const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("version")
        .setDescription("Check the version of the backend!"),

    async execute(interaction) {
        try {
            const response = await axios.get('http://127.0.0.1:3551/version');

            const backendVersionInfo = response.data.version; 
            const backendName = response.data.backend;

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle(backendName)
                .setDescription("Version Is: " + backendVersionInfo);

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Error executing ping command:", error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
