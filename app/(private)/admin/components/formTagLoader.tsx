"use server"

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import ProjectForm from "@/app/(private)/admin/components/projectForm";

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
    const tagsRaw = await getTags() as {title:string,objectId:string}[];
    const tagsRefined = tagsRaw!.map(tag => ({display:tag.title,value:tag.objectId}))
    return (
        <div className={'w-full flex justify-center max-w-[90svw] mb-6'}>
            <div className={'w-9/10'}>
                <ProjectForm tags={tagsRefined??[]} />
            </div>
        </div>
    )
}