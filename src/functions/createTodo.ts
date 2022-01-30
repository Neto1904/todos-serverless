import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from '../utils/dynamodbClient'
import { v4 as uuid } from 'uuid'

interface ICreateTodo {
    id: string
    userId: string
    title: string
    done: boolean
    deadline: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo
    const { userId } = event.pathParameters

    const todo: ICreateTodo = {
        id: uuid(),
        userId,
        title,
        done: false,
        deadline
    }

    await document.put({
        TableName: 'usersTodos',
        Item: todo
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo generated successfully!',
            todo
        })
    }
}