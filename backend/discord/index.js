require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const verboseLogging = process.env.VERBOSE_LOGGING;

// TODO: add ban command, make sure it can only be used by admins.

client.once('ready', () => {
    console.log(chalk.keyword("orange")("[BOT] ") + `Logged in as ${client.user.tag}!`);
    registerCommands();
    setBotStatus();
});

async function registerCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        if (verboseLogging == "true") {
            console.log(chalk.keyword("orange")("[BOT] ") + 'Started refreshing application (/) commands.');
        }
        await rest.put(
            Routes.applicationCommands(client.user.id), 
            { body: commands }
        );
        if (verboseLogging == "true") {
            console.log(chalk.keyword("orange")("[BOT] ") + 'Successfully reloaded application (/) commands.');
        }
    } catch (error) {
        console.error('Error reloading commands:', error);
    }
}

function setBotStatus() {
    client.user.setPresence({
        activities: [
            {
                name: "Backend S12",
                type: ActivityType.Watching 
            }
        ],
        status: 'dnd' 
    })
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = require(`./commands/${interaction.commandName}.js`);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'downloadUpdate') {
            await interaction.deferUpdate();
            
            await interaction.followUp(
                { content: 'This feature is not available right now!', ephemeral: true }
            );
        }
    } catch (error) {
        console.error("Error during button interaction:", error);
    }
});

client.login(process.env.BOT_TOKEN);
