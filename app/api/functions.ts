import {dynamoObject} from "@/types";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    PutCommandOutput,
    UpdateCommand,
    UpdateCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export async function dynamoPutCommandBuilder(
    client:DynamoDBDocumentClient,
    objectType:string,
    table:string,
    object:dynamoObject
):Promise<PutCommandOutput>{
    let newId = uuidv4();
    let getCommand = new GetCommand({
        TableName: table,
        Key: {
            objectType: objectType,
            objectId: newId,
        },
    });
    let foundProject = await client.send(getCommand);
    while(foundProject.Item){
        newId = uuidv4();
        getCommand = new GetCommand({
            TableName: table,
            Key: {
                objectType: objectType,
                objectId: newId,
            },
        })
        foundProject = await client.send(getCommand);
    }
    const newItem:dynamoObject={
        ...object,
        objectType: objectType,
        objectId:newId,
    }
    const putCommand = new PutCommand({
        TableName: table,
        Item: newItem
    })
    return client.send(putCommand);
}



export function dynamoUpdateCommandBuilder(
    client:DynamoDBDocumentClient,
    table:string,
    key:dynamoObject,
    changes:dynamoObject
):Promise<UpdateCommandOutput>{
    const commands:string[] = [];
    const expressionAttributeValues:dynamoObject = {};
    const expressionAttributeNames:Record<string, string> = {};
    const keys = Object.keys(changes);
    for (const key of keys) {
        let attributeAlias = key[0];
        while (expressionAttributeNames[attributeAlias]) {
            attributeAlias = attributeAlias + "a";
        }
        expressionAttributeNames['#'+attributeAlias] = key;
        commands.push(`#${attributeAlias} = :${attributeAlias}`);
        expressionAttributeValues[`:${attributeAlias}`] = changes[key];
    }
    const updateExpression = `SET ${commands.join(', ')}`
    const updateCommand = new UpdateCommand({
        TableName: table,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames
    });
    return client.send(updateCommand);
}