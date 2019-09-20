#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import {AwsCdkBatchStack} from "../lib/aws-cdk-batch-stack";

const app = new cdk.App();
new AwsCdkBatchStack(app, 'AwsCdkStack');