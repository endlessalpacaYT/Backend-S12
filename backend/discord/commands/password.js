const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const verboseLogging = process.env.VERBOSE_LOGGING;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("password")
        .setDescription("Change your account password.")
        .addStringOption(option =>
            option.setName("password")
                .setDescription("Your desired password.")
                .setRequired(true)),

    async execute(interaction) {
        const password = interaction.options.getString('password');
        const userId = interaction.user.id;


        

        try {
            const existingUser = await User.findOne({ discordId: userId });

            if (!existingUser) {
              
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to change password")
                    .setDescription("Reason: You do not have an account.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

          const hashedPassword = await bcrypt.hash(password, 10);
          await existingUser.updateOne({ $set: { password: hashedPassword } });

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully changed password")
                .setDescription("You have successfully changed your password");

            await interaction.reply({ embeds: [embed], ephemeral: true });

            if (verboseLogging === "true") {
                console.log("User: " + userId + " has changed their password.");
            }
        } catch (error) {
            console.error('Error registering user:', error);
            await interaction.reply({ content: 'There was an error executing this command. Please try again later.', ephemeral: true });
        }
    }
};
