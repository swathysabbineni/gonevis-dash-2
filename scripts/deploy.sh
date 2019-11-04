#!/usr/bin/env bash

if ! [ -x "$(command -v rsync)" ]; then
  echo 'Error: rsync is not installed.' >&2
  exit 1
fi

if [ "${CIRCLE_BRANCH}" == "master" ]; then
    ENVIRONMENT="staging"
    DEPLOY_PATH="~/public_html/dash-draft.gonevis.com"
elif [ "${CIRCLE_BRANCH}" == "production" ]; then
    ENVIRONMENT="production"
    DEPLOY_PATH="~/dash.gonevis.com"
else
    echo "NO DEPLOYMENT FOR NOW."
    exit
fi

echo "Deployment on ${ENVIRONMENT} environment!"

npm run build-$ENVIRONMENT
DEPLOY_COMMAND="rm -rf $DEPLOY_PATH/*"
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $DEPLOY_USER@$DEPLOY_HOST -p$DEPLOY_SSH_PORT $DEPLOY_COMMAND
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p$DEPLOY_SSH_PORT" --progress .htaccess dist/gonevis/* $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH

# Notifying Rollbar of the deployment
LOCAL_USERNAME=`whoami`
REVISION=`git log -n 1 --pretty=format:"%H"`

curl https://api.rollbar.com/api/1/deploy/ \
  -F access_token=$ROLLBAR_ACCESS_TOKEN \
  -F environment=$ENVIRONMENT \
  -F revision=$REVISION \
  -F local_username=$LOCAL_USERNAME
