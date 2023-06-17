/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";

export const command = new SlashCommandBuilder()
    .setName('invitemegithub')
    .setDescription('Invite me to the GitHub organization!')
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand
            .setName('request')
            .setDescription('Request a code to verify account ownership of your GitHub account.')
            .addStringOption((option) =>
                option
                    .setName('github-username')
                    .setDescription('Your GitHub username.')
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand
            .setName('verify')
            .setDescription('Verify your GitHub account ownership and get access to the GitHub organization.')
            .addStringOption((option) =>
                option
                    .setName('github-username')
                    .setDescription('Your GitHub username.')
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('gist-url')
                    .setDescription('The URL to the gist containing the verification code.')
                    .setRequired(true)
            )
    )
