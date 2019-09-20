import cdk = require("@aws-cdk/core");
import batch = require("@aws-cdk/aws-batch");
import cloudwatch = require("@aws-cdk/aws-cloudwatch");
import events = require("@aws-cdk/aws-events");
import eventTarget = require("@aws-cdk/aws-events-targets");
import {StackProps} from "@aws-cdk/core";
import {CfnRule, IRule, IRuleTarget, RuleTargetConfig} from "@aws-cdk/aws-events";

export class AwsCdkBatchStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: StackProps) {
        super(scope, id, props);
        let batchJob = new batch.CfnJobDefinition(this, 'job-def', {
            jobDefinitionName: 'job-a',
            type: 'container',
            containerProperties: {
                command: ['echo', 'hello world'],
                image: 'alpine:3.10',
                memory: 500,
                privileged: false,
                vcpus: 1,
                // jobRoleArn: '',
            },
            retryStrategy: {
                attempts: 1,
            },
            timeout: {
                attemptDurationSeconds: 60, //min
            }
        });

        let computeEnv = new batch.CfnComputeEnvironment(this, 'compute-env', {
            computeEnvironmentName: 'compute-a',
            state: "ENABLED",
            type: "MANAGED",
            serviceRole: "arn:aws:iam::885860564745:role/AWSBatchServiceRole",
            computeResources: {
                securityGroupIds: ['sg-0495bfafcbf106ea6'],
                subnets: ['subnet-f91f0091', 'subnet-f91f0091', 'subnet-812c91cd'],
                instanceTypes: ["a1.medium"],
                type: 'EC2',
                minvCpus: 0,
                maxvCpus: 1,
                instanceRole: 'arn:aws:iam::885860564745:role/ecsInstanceRole',
                tags: {
                    'use': 'batch'
                },
                // imageId:
            },
        });

        let jobQueue = new batch.CfnJobQueue(this, 'batch-queue', {
            jobQueueName: 'queue-a',
            priority: 1,
            state: "ENABLED",
            computeEnvironmentOrder: [
                {
                    computeEnvironment: 'arn:aws:batch:us-east-2:885860564745:compute-environment/compute-a',
                    order: 1
                },
            ]
        });


        let event = new events.Rule(this, 'event-rule', {
            description: 'Event rule to submit a batch job to a target job queue on schedule',
            // eventPattern: {
            //     account: ['123456789012'],
            //     region: ['us-east-2'],
            //     // resources: ['arn:aws:events:us-east-1:123456789012:rule/SampleRule'],
            //     detailType: ['scheduled job submit'],
            // },
            ruleName: 'batch-job-a-cron-trigger',
            enabled: false,
            schedule: {
                expressionString: 'cron(0 0 12 1/1 * ? *)'
            },
        });
    }
}