import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import path = require('path');
import {StackProps} from "@aws-cdk/core";

export class AwsCdkLambdaStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: StackProps) {
        super(scope, id, props);

        const hello = new lambda.Function(this, 'Hello-Handler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../resources')),
            timeout: cdk.Duration.seconds(30),
            handler: 'hello.handler',
        });
    }
}