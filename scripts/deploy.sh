#!/usr/bin/env bash

if ! [ -x "$(command -v rsync)" ]; then
  echo 'Error: rsync is not installed.' >&2
  exit 1
fi

npm run build-production
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $DEPLOY_USER@$DEPLOY_HOST -p$DEPLOY_SSH_PORT 'rm -rf public_html/dash.gonevis.com/*'
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p$DEPLOY_SSH_PORT" --progress .htaccess dist/gonevis/* $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
