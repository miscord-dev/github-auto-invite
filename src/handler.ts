import { requestSubCommand, rootCommand, verifySubCommand } from "./command";
import { APIApplicationCommandInteraction, APIApplicationCommandInteractionData, APIApplicationCommandInteractionDataOption, APIApplicationCommandInteractionDataStringOption, APIApplicationCommandInteractionDataSubcommandOption, APIApplicationCommandStringOption, APIApplicationCommandSubcommandOption, APIChatInputApplicationCommandInteraction, APIChatInputApplicationCommandInteractionData, APIInteraction, APIInteractionDataOptionBase, APIInteractionResponseCallbackData, APIModalInteractionResponseCallbackData, ApplicationCommandOptionType, ApplicationCommandType, InteractionResponseType } from "discord-api-types/v10";
import { APIPingInteraction } from 'discord-api-types/payloads/v10/_interactions/ping'
import { InteractionType } from "discord-interactions";
import { JsonResponse } from "./utils";
import { Endpoints } from '@octokit/types';
import { getGithubApp } from "./octokit";

type InteractionResponse = {
    type: InteractionResponseType;
    data?: APIInteractionResponseCallbackData | APIModalInteractionResponseCallbackData;
}

export const handle = async (interaction: APIApplicationCommandInteraction, env: Env) => {
    switch (interaction.data?.name.toLowerCase()) {
        case rootCommand.name.toLowerCase(): {
            return handleRootCommand(interaction, env);
        }
    }
}

const handleRootCommand = async (interaction: APIApplicationCommandInteraction, env: Env) => {
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;
    if (!data?.options) return new Response();

    switch (data.options[0].name.toLowerCase()) {
        case requestSubCommand.name.toLowerCase(): {
            return handleRequestSubCommand(data.options[0] as APIApplicationCommandInteractionDataSubcommandOption, env);
        }
        case verifySubCommand.name.toLowerCase(): {
            return handleVerifySubCommand(data.options[0] as APIApplicationCommandInteractionDataSubcommandOption, env);
        }
    }
}

const handleRequestSubCommand = async (data: APIApplicationCommandInteractionDataSubcommandOption, env: Env) => {
    if (!data?.options) return new Response();

    return new JsonResponse(<InteractionResponse>{
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `Hi, welcome to the GitHub organization!  Please follow the instructions here to verify your GitHub account ownership:

1. Open https://gist.github.com/
2. Create a gist and put Organization ID in the file. The Organization ID is \`${env.GITHUB_ORG_ID}\`. You can see [this gist](https://gist.github.com/musaprg/d7d6b4de23d21809bd01b219e88c477c) as a sample.
3. Run \`/invitemegithub verify <your-github-username> <gist-id>\` to verify your GitHub account ownership. For example, \`/invitemegithub verify musaprg d7d6b4de23d21809bd01b219e88c477c\`
`,
        }
    })
};

type getGistResponse = Endpoints["GET /gists/{gist_id}"]["response"]["data"];

const handleVerifySubCommand = async (data: APIApplicationCommandInteractionDataSubcommandOption, env: Env) => {
    if (!data?.options) {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Please provide your GitHub username and the gist ID. For example, \`/invitemegithub verify musaprg d7d6b4de23d21809bd01b219e88c477c\``,
            }
        });
    }

    console.log("interaction.data:", data);

    const username = (data.options[0] as APIApplicationCommandInteractionDataStringOption).value;
    const gistId = (data.options[1] as APIApplicationCommandInteractionDataStringOption).value;

    const gistAPIEndpoint = `https://api.github.com/gists/${gistId}`;
    console.log("fetching gist:", gistAPIEndpoint);
    const response = await fetch(gistAPIEndpoint, {
        headers: {
            "User-Agent": "InviteMeGitHub",
        }
    });
    if (!response.ok) {
        switch (response.status) {
            case 404: {
                return new JsonResponse(<InteractionResponse>{
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `The gist you provided doesn't exist. Please try again.`,
                    }
                });
            }
            default: {
                console.log("failed to fetch gist:", response.status, response.statusText, await response.text())
                return new JsonResponse(<InteractionResponse>{
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `An error occurred while fetching the gist. Please try again.`,
                    }
                });
            }
        }
    }

    // check if the file in gist contains the organization id
    const gist = await response.json() as getGistResponse;
    const files = gist?.files;
    if (!files) {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `The gist you provided doesn't have any files.`,
            }
        });
    }
    const file = files[Object.keys(files)[0]];
    if (!file?.content?.includes(env.GITHUB_ORG_ID)) {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `The gist you provided does not contain the organization ID. Please try again.`,
            }
        });
    }

    // check if the passed user is the owner of this gist
    const owner = gist?.owner;
    if (!owner) {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `The gist you provided doesn't have an owner.`,
            }
        });
    }
    if (owner.login !== username) {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `The gist you provided is not owned by you.`,
            }
        });
    }

    // send invitation to the user
    const app = await getGithubApp(env);
    return await app.request('POST /orgs/{org}/invitations', {
        org: env.GITHUB_ORG_ID,
        invitee_id: owner.id,
        role: 'direct_member',
    }).then(({ data }) => {
        return new JsonResponse(<InteractionResponse>{
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `The invitation has been sent to the user. Please check your email.`,
            }
        })
    }).catch((err) => {
        switch (err.status) {
            case 404: {
                return new JsonResponse(<InteractionResponse>{
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `The organization you provided doesn't exist.`,
                    }
                });
            }
            case 422: {
                return new JsonResponse(<InteractionResponse>{
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `The user you provided is already a member of the organization.`,
                    }
                });
            }
            default: {
                console.log("failed to send invitation:", err.status, err.message, err.errors)
                return new JsonResponse(<InteractionResponse>{
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `An error occurred while sending the invitation. Please try again.`,
                    }
                });
            }
        }
    });
};
