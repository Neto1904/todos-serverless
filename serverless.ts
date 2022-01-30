import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'todos',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild', 
    'serverless-dynamodb-local', 
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: ['*']
      }
    ]
  },
  // import the function via paths
  functions: { 
    createTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{userId}',
            method: 'post',
            cors: true
          }
        }
      ]
    },
    getUserTodo: {
      handler: 'src/functions/getUserTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{userId}',
            method: 'get',
            cors: true
          }
        }
      ]
    }
   },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources: { 
    Resources: {
      usersTodos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'usersTodos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH'
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;