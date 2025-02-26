#!/bin/bash

# package backend
cd backend
dotnet publish -c Release -o ../publish/CruiseShipApi
cd ../publish/CruiseShipApi
zip -r ../CruiseShipApi.zip *
cd ../../

# Deploy the API stack
cd ./cdk
cdk deploy CruiseShipApiStack

# Get the API URL from the deployed stack
API_BASE_URL=$(aws cloudformation describe-stacks --stack-name CruiseShipApiStack --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)

# Update the config.ts file with the API_BASE_URL
CONFIG_FILE_PATH="../frontend/src/config.ts"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|__API_BASE_URL__|$API_BASE_URL|g" $CONFIG_FILE_PATH
else
    sed -i "s|__API_BASE_URL__|$API_BASE_URL|g" $CONFIG_FILE_PATH
fi

# Deploy the website stack
cd ../frontend
npm install
npm run build

# Restore the placeholder in the config.ts file for future deployments
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|$API_BASE_URL|__API_BASE_URL__|g" $CONFIG_FILE_PATH
else
    sed -i "s|$API_BASE_URL|__API_BASE_URL__|g" $CONFIG_FILE_PATH
fi

cd ../cdk
cdk deploy CruiseShipWebsiteStack
cd ..