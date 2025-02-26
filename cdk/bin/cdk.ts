#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CruiseShipApiStack } from '../lib/cruise-ship-api-stack';
import { CruiseShipWebsiteStack } from '../lib/cruise-ship-website-stack';

const app = new cdk.App();
new CruiseShipApiStack(app, 'CruiseShipApiStack', {});
new CruiseShipWebsiteStack(app, 'CruiseShipWebsiteStack', {});