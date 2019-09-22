#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import {AwsCdkBatchStack} from "../lib/aws-cdk-batch-stack";
import {AwsCdkLambdaStack} from "../lib/aws-cdk-lambda-stack";

const app = new cdk.App();
// new AwsCdkBatchStack(app, 'CdkBatchStack', {
//     env: {
//         account: '885860564745',
//         region: 'us-east-2',
//     }
// });
new  AwsCdkLambdaStack(app, 'CDKLambdaStack', {
    env: {
        account: '885860564745',
        region: 'us-east-1',
    }
});