const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("details")
        .setDescription("Get user details from backend"),

    async execute(interaction) {
        try {
            const user = await User.findOne({ discordId: userId });

            if (!user) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to fetch details.")
                    .setDescription("Reason: You do not have an active account.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("User Details")
                .setDescription("User details for: " + username)
                .addFields([
                  {
                    name: "Username",
                    value: user.username,
                    inline: true
                  },
                  {
                    name: "Email",
                    value: user.email,
                    inline: true
                  },
                  {
                    name: "User ID",
                    value: user.accountId,
                    inline: true
                  },
                  {
                    name: "Email",
                    value: user.email,
                    inline: true
                  },
                  ])
                  .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });

            if (verboseLogging === "true") {
                console.log("User: " + userId + " has used the details command");
            }
        } catch (error) {
            console.error('Error getting details:', error);
            await interaction.reply({ content: 'There was an error executing this command. Please try again later.', ephemeral: true });
        }
    }
};
