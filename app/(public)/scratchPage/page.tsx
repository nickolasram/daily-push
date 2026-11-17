"use server"

import {PushDynamoTag} from "@/models";

export default async function Page(){

    const tags = await PushDynamoTag.getAllTags('daily-push')
    console.log(tags)

    return (
        <div>
            scratchPage
        </div>
    )
}