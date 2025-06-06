#!/bin/bash
export NODE_ENV=development
rm -rf dist
rm -rf dist.zip
yarn build
yarn generate
zip -r dist.zip dist
scp dist.zip root@146.190.104.173:/home/domains/chatbot-dev
rm -rf dist.zip
clear
echo "=============***============="
echo "Build Prod Successfuly"