import cdk = require("@aws-cdk/core");
import batch = require("@aws-cdk/aws-batch");
import events = require("@aws-cdk/aws-events");
import {StackProps} from "@aws-cdk/core";

export class AwsCdkBatchStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: StackProps) {
        super(scope, id, props);
        let jobDefinition = new batch.CfnJobDefinition(this, 'job-def', {
            jobDefinitionName: 'job-a',
            type: 'container',
            containerProperties: {
                command: ['echo', 'hello world'],
                image: '885860564745.dkr.ecr.us-east-2.amazonaws.com/alpine-hello-world:latest',
                memory: 1000,
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
                subnets: [
                    'subnet-f91f0091',
                    'subnet-cb693cb1',
                    // 'subnet-812c91cd'
                ],
                instanceTypes: ["m4.large"],
                // instanceTypes: ["a1.medium"],
                type: 'EC2',
                minvCpus: 0,
                maxvCpus: 1,
                instanceRole: 'arn:aws:iam::885860564745:instance-profile/ecsInstanceRole',
                tags: {
                    'use': 'batch'
                },
                imageId: 'ami-05d2a15ff7d946a69',           // /aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id
                // imageId: 'ami-08e0ac9f9ad1578f0',       // 64 bit image
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
        jobQueue.addDependsOn(computeEnv);
        jobDefinition.addDependsOn(jobQueue);
        //
        // const fn = new lambda.Function(this, 'trigger-batch-fn', {
        //     runtime: lambda.Runtime.NODEJS_10_X,
        //     timeout: cdk.Duration.seconds(30),
        //     handler: 'index.handler',
        //     code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
        //     role: 'arn:aws:iam::885860564745:role/service-role/AWS_Events_Invoke_Batch_Job_Queue_296665447',
        //
        // });
        //
        //
        // let lambdaEventTarget = new eventTarget.LambdaFunction(fn);
        //
        // const hello = new lambda.Function(this, 'Hello-Handler', {
        //     runtime: lambda.Runtime.NODEJS_10_X,
        //     code: lambda.Code.fromAsset(path.join(__dirname, '../resources')),
        //     timeout: cdk.Duration.seconds(30),
        //     handler: 'hello.handler',
        // });


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
                expressionString: 'cron(0 9,18 * * ? *)'
            },
        });
    }
}