import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { Duration } from 'aws-cdk-lib';

export class CruiseShipApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for the ASP.NET Core API
    const apiLambda = new lambda.Function(this, 'ApiLambda', {
      runtime: lambda.Runtime.DOTNET_8,
      code: lambda.Code.fromAsset('../publish/CruiseShipApi.zip'),
      handler: 'CruiseShipApi::CruiseShipApi.LambdaEntryPoint::FunctionHandlerAsync',
      memorySize: 512,
      timeout: Duration.seconds(30)
    });

    // API Gateway with Lambda Proxy Integration
    const api = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'CruiseShipApi',
      deployOptions: {
        stageName: 'prod'
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowCredentials: true,
      },
    });

     // Lambda integration
     const lambdaIntegration = new apigateway.LambdaIntegration(apiLambda);

     // Create API Gateway root method to forward all traffic to Lambda
     const proxyResource = api.root.addProxy({
      anyMethod: true,
      defaultIntegration: lambdaIntegration,
     });

     new apigateway.Deployment(this, 'ApiDeployment', {
      api: api,
    });
 
     // Output the API Gateway URL
     new cdk.CfnOutput(this, 'ApiUrl', {
       value: api.url,
       description: 'The URL of the API Gateway endpoint'
     });
  }
}
