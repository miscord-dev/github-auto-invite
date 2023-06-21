/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { InteractionType } from "discord-interactions";

// https://discord.com/developers/docs/interactions/application-commands#slash-commands

type ApplicationCommand = {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: ApplicationCommandOption[];
}

type ApplicationCommandOption = {
    name: string;
    description: string;
    type: ApplicationCommandOptionType;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
}

type ApplicationCommandOptionChoice = {
    name: string;
    value: string | number;
}

export const verifySubCommand = <ApplicationCommandOption>{
    name: 'verify',
    description: 'Verify your GitHub account ownership and get access to the GitHub organization.',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
        {
            name: 'github-username',
            description: 'Your GitHub username.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'gist-url',
            description: 'The URL to the gist containing the verification code.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};

const requestSubCommand = <ApplicationCommandOption>{
    name: 'request',
    description: 'Request access to the GitHub organization.',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
        {
            name: 'github-username',
            description: 'Your GitHub username.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};

export const rootCommand = <ApplicationCommand>{
    name: 'invitemegithub',
    description: 'Invite me to the GitHub organization!',
    type: ApplicationCommandType.ChatInput,
    options: [
        requestSubCommand,
        verifySubCommand,
    ],
};
