import { Router } from 'itty-router';
import { JsonResponse, verifyDiscordRequest } from './utils';
import { handle, rootCommand } from './command';
import { InteractionResponseType, InteractionType } from 'discord-api-types/v10';



// now let's create a router (note the lack of "new")
const router = Router();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
	return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env: Env) => {
	const { isValid, interaction } = await verifyDiscordRequest(request, env);
	if (!isValid || !interaction) {
		return new Response('Bad request signature', { status: 401 });
	}

	console.log(JSON.stringify(interaction, null, 2));

	if (interaction.type === InteractionType.Ping) {
		// The `PING` message is used during the initial webhook handshake, and is
		// required to configure the webhook in the developer portal.
		console.log('Handling Ping request');
		return new JsonResponse({
			type: InteractionResponseType.Pong
		});
	}

	if (interaction.type === InteractionType.ApplicationCommand) {
		return handle(interaction, env);
	}
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
