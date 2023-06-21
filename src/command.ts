/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import { APIApplicationCommandInteraction, APIApplicationCommandInteractionData, APIChatInputApplicationCommandInteractionData, APIInteraction, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { APIPingInteraction } from 'discord-api-types/payloads/v10/_interactions/ping'
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

export const handle = async (interaction: APIApplicationCommandInteraction) => {
    switch (interaction.data?.name.toLowerCase()) {
        case rootCommand.name.toLowerCase(): {
            return handleRootCommand(interaction);
        }
    }
}

const handleRootCommand = async (interaction: APIApplicationCommandInteraction) => {
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;
    if (!data?.options) return new Response();

    switch (data.options[0].name.toLowerCase()) {
        case requestSubCommand.name.toLowerCase(): {
            return handleRequestSubCommand(interaction);
        }
        case verifySubCommand.name.toLowerCase(): {
            return handleVerifySubCommand(interaction);
        }
    }
}

const handleRequestSubCommand = async (interaction: APIApplicationCommandInteraction) => {
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;
    if (!data?.options) return new Response();

    // FIXME: implement me
};

const handleVerifySubCommand = async (interaction: APIApplicationCommandInteraction) => {
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;
    if (!data?.options) return new Response();

    // FIXME: implement me
};
