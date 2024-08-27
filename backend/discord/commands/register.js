const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Create An Account On Backend S12!"),

    async execute(interaction) {
        await interaction.reply({ content: 'Register command executed!' });
    }
}