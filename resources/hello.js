const AWS = require('aws-sdk')
const batch = new AWS.Batch();

exports.handler = async function (event, context) {
    console.log("ENVIRONMENT VARIABLES\n:" + JSON.stringify(process.env, undefined, 2));
    console.log('EVENT:\n', JSON.stringify(event, undefined, 2));
    console.log("path: " + event.detail.path);
    console.log("jobArn: " + event.detail.jobArn);
    let batchSubmitRequest = batch.submitJob({
        jobName: 'test-from-lambda',
        jobQueue: 'arn:aws:batch:us-east-1:885860564745:job-queue/first-run-job-queue',
        jobDefinition: 'arn:aws:batch:us-east-1:885860564745:job-definition/first-run-job-definition:1',
        retryStrategy: {
            attempts: 1
        },
    });
    return await batchSubmitRequest.promise();
};