interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;

	DISCORD_APPLICATION_ID: string;

	DISCORD_PUBLIC_KEY: string;

	DISCORD_TOKEN: string;

	GITHUB_ORG_ID: string;

	GITHUB_APP_PRIVATE_KEY: string;

	GITHUB_APP_ID: string;

	GITHUB_APP_INSTALLATION_ID: string;

	GITHUB_APP_CLIENT_ID: string;

	GITHUB_APP_CLIENT_SECRET: string;
}