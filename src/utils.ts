import {
    verifyKey,
} from 'discord-interactions';
import { APIInteraction } from 'discord-api-types/v10';
import { IRequest } from 'itty-router';

export async function verifyDiscordRequest(request: IRequest, env: Env): Promise<{ isValid: boolean, interaction: APIInteraction | undefined }> {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    const isValidRequest =
        signature &&
        timestamp &&
        verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
        return { isValid: false, interaction: undefined };
    }

    return { interaction: JSON.parse(body), isValid: true };
}