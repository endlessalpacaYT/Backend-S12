require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const path = require("path");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const verboseLogging = process.env.VERBOSE_LOGGING;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    registerCommands();
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
            console.log('Started refreshing application (/) commands.');
        }
        await rest.put(
            Routes.applicationCommands(client.user.id), 
            { body: commands }
        );
        if (verboseLogging == "true") {
            console.log('Successfully reloaded application (/) commands.');
        }
    } catch (error) {
        console.error('Error reloading commands:', error);
    }
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

client.login(process.env.BOT_TOKEN);
