const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Create An Account On Backend S12!")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("What Do You Want Your Ingame Username To Be?")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("email")
                .setDescription("Your Email Which Will Be Used To Login.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("password")
                .setDescription("Your Password Which Will Be Used To Login.")
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');
        const embed = new EmbedBuilder()
            .setColor("#a600ff")
            .setTitle("Successfully Registered")
            .setDescription("Registered With The Username: " + username);

        await interaction.reply({ embeds: [embed] });
        if (verboseLogging == "true") {
            console.log("A User Has Registered With The Username: " + username);
        }
    }
}