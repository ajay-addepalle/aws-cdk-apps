import sns = require("@aws-cdk/aws-sns");
import subs = require("@aws-cdk/aws-sns-subscriptions");
import sqs = require("@aws-cdk/aws-sqs");
import cdk = require("@aws-cdk/core");
import dynamoDb = require("@aws-cdk/aws-dynamodb");
import { RemovalPolicy } from "@aws-cdk/core";
import { AttributeType, ProjectionType } from "@aws-cdk/aws-dynamodb";
export class AwsCdkDdbStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ddb = new dynamoDb.Table(this, "Extract", {
      partitionKey: {
        name: "hash",
        type: AttributeType.STRING
      },
      tableName: "extract_table",
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.RETAIN,
      readCapacity: 5,
      writeCapacity: 2,
      sortKey: {
        name: "version",
        type: AttributeType.NUMBER
      },
      serverSideEncryption: true
    });

    ddb.addGlobalSecondaryIndex({
      indexName: "perf",
      partitionKey: {
        name: "perf",
        type: AttributeType.STRING
      },
      projectionType: ProjectionType.ALL
    });
  }
}
