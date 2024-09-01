const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("username")
        .setDescription("Change your ingame username.")
        .addStringOption(option =>
            option.setName("email")
                .setDescription("Your desired username.")
                .setRequired(true)),

    async execute(interaction) {
        const email = interaction.options.getString('username');
        const userId = interaction.user.id;


        

        try {
            const existingUser = await User.findOne({ discordId: userId });

            if (!existingUser) {
              
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to change username.")
                    .setDescription("Reason: You do not have an account.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

          await existingUser.updateOne({ $set: { username: username } });

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully changed username")
                .setDescription("You have successfully changed your username);

            await interaction.reply({ embeds: [embed], ephemeral: true });

            if (verboseLogging === "true") {
                console.log("User: " + userId + " has changed their email.");
            }
        } catch (error) {
            console.error('Error changing email:', error);
            await interaction.reply({ content: 'There was an error executing this command. Please try again later.', ephemeral: true });
        }
    }
};
