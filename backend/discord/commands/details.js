const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("details")
        .setDescription("See your account info!"),

    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            try {
                const user = await User.findOne({ discordId: userId });
                const username = user.username;

                if (user) {
                    const embed = new EmbedBuilder()
                        .setColor("#a600ff")
                        .setTitle("You Have An Account!")
                        .setDescription(`You Have An Account With DiscordID: ${userId} With Username: ${username}`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
            }catch (err) {
                const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("You Do Not Have An Account!")
                .setDescription("Create An Account Using /register");

            await interaction.reply({ embeds: [embed], ephemeral: true });
            }

        } catch (error) {
            console.error('Error Executing Command:', error);
            await interaction.reply({ content: 'There was an error executing the command. Please try again later.', ephemeral: true });
        }
    }
};
