import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import events = require("@aws-cdk/aws-events");
import eventsTarget = require("@aws-cdk/aws-events-targets");
import iam = require("@aws-cdk/aws-iam");

import path = require('path');
import {StackProps} from "@aws-cdk/core";

export class AwsCdkLambdaStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: StackProps) {
        super(scope, id, props);


        const lambdaFn = new lambda.Function(this, 'Hello-Handler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../resources')),
            timeout: cdk.Duration.seconds(10),
            handler: 'hello.handler',
        });




        let event = new events.Rule(this, 'event-rule', {
            description: 'Event rule to submit a batch job to a target job queue on schedule',
            // eventPattern: {
            //     account: ['123456789012'],
            //     region: ['us-east-1'],
            //     // resources: ['arn:aws:events:us-east-1:123456789012:rule/SampleRule'],
            //     detailType: ['scheduled job submit'],
            // },
            ruleName: 'batch-job-a-cron-trigger',
            enabled: false,
            schedule: {
                // expressionString: events.Schedule.cron({
                //     minute: '0/10',
                //     hour: '*',
                //     day: '*',
                //     month: '*',
                //     weekDay: '?',
                //     year: '*',
                // }).expressionString
                expressionString: 'rate(10 minutes)'
            },
            targets: [
                new eventsTarget.LambdaFunction(lambdaFn)
            ]
        });

    }
}