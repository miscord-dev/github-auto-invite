# github-auto-invite

Discord slash command to invite the user to the specified GitHub Organization automatically.

## Setup

```shell-session
$ echo ${GITHUB_APP_PRIVATE_KEY_PATH?}
sample-github-app.2334-01-01.private-key.pem
$ openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in ${GITHUB_APP_PRIVATE_KEY_PATH?} -out ${GITHUB_APP_PRIVATE_KEY_PATH?}.pkcs8
$ awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' ${GITHUB_APP_PRIVATE_KEY_PATH?}.pkcs8
$ wrangler secret put GITHUB_TOKEN
$ wrangler secret put GITHUB_ORG_ID
$ wrangler secret put GITHUB_APP_ID
$ wrangler secret put GITHUB_APP_INSTALLATION_ID
$ wrangler secret put GITHUB_APP_CLIENT_ID
$ wrangler secret put GITHUB_APP_CLIENT_SECRET
```