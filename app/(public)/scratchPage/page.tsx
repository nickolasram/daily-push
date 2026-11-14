"use server"

import ClientScratchForm from "@/app/(public)/scratchPage/clientScratchForm";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {getDynamoClient} from "@/globalFunctions/functions";
import {PushTag} from "@/types";
import { Suspense } from "react";

async function getTags() {
    const allTags = new QueryCommand({
        TableName:'daily-push',
        KeyConditionExpression: 'objectType = :ta',
        ExpressionAttributeValues: {
            ':ta': 'tag'
        }
    })

    const client = await getDynamoClient()
    const response = await client.send(allTags);
    return response.Items;
}

export default async function Page(){

    const tags = await getTags() as PushTag[];

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <ClientScratchForm
                    loadedTags={tags}
                />
            </Suspense>
        </div>
    )
}