import { App } from "@octokit/app";

export const getGithubApp = async (env: Env) => {
    const app = new App({
        appId: env.GITHUB_APP_ID,
        privateKey: env.GITHUB_APP_PRIVATE_KEY,
        oauth: {
            clientId: env.GITHUB_APP_CLIENT_ID,
            clientSecret: env.GITHUB_APP_CLIENT_SECRET,
        },
    });

    const installationOctokit = await app.getInstallationOctokit(parseInt(env.GITHUB_APP_INSTALLATION_ID));
    return installationOctokit;
}
