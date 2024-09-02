const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("email")
        .setDescription("Change your account email.")
        .addStringOption(option =>
            option.setName("email")
                .setDescription("Your desired email.")
                .setRequired(true)),

    async execute(interaction) {
        const email = interaction.options.getString('email');
        const userId = interaction.user.id;


        

        try {
            const existingUser = await User.findOne({ discordId: userId });

            if (!existingUser) {
              
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to change email")
                    .setDescription("Reason: You do not have an account.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

          await existingUser.updateOne({ $set: { email: email } });

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully changed email")
                .setDescription("You have successfully changed your email");

            await interaction.reply({ embeds: [embed], ephemeral: true });

            if (verboseLogging === "true") {
                console.log("User: " + username + " has changed their email.");
            }
        } catch (error) {
            console.error('Error changing email:', error);
            await interaction.reply({ content: 'There was an error executing this command. Please try again later.', ephemeral: true });
        }
    }
};
