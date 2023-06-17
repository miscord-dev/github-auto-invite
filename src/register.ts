import dotenv from 'dotenv';
import process from 'node:process';
import { command } from './command';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
    throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
    throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const rest = new REST({ version: '10' }).setToken(token);
await rest.put(
    Routes.applicationCommands(applicationId),
    { body: [command] }
);