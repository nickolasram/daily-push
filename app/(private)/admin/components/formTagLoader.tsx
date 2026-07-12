"use server"

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import ProjectForm from "@/app/(private)/admin/components/projectForm";
import {PushProject} from "@/types";
import {tag} from "@smithy/core/cbor";

async function getTags() {
    function docClient(){
        const dbClient = new DynamoDBClient({
            credentials:{
                accessKeyId:process.env.NEXT_PUBLIC_ACCESS_KEY as string,
                secretAccessKey:process.env.NEXT_PUBLIC_SECRET_KEY as string
            }
        })
        return DynamoDBDocumentClient.from(dbClient)
    }

    const allTags = new QueryCommand({
        TableName:'daily-push',
        KeyConditionExpression: 'objectType = :ta',
        ExpressionAttributeValues: {
            ':ta': 'tag'
        }
    })

    const response = await docClient().send(allTags);
    return response.Items;
}

export default async function FormTagLoader(){
    const tagsRaw = await getTags();
    const tagsRefined = tagsRaw!.map(tag => tag.objectId)
    return (
        <ProjectForm tags={tagsRefined} />
    )
}