import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from '../utils/dynamodbClient'

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters

    const response = await document
    .query({
        TableName: 'usersTodos',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    if(response.Items.length === 0) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'No todos found for specified user!'
            })
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({
            todos: response.Items
        })
    }
}