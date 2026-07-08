'use server'

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushTag} from "@/types";

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

const TagsList=async()=>{
    let tags = await getTags() as PushTag[];
    return (
        <>
            { tags!.length == 0 &&
                <p>no projects found</p>
            }
            { tags!.length > 0 &&
                <>
                    { tags!.map((tag,i) => {
                        return (<p key={i}>{tag.title}</p>)
                    })
                    }
                </>
            }
        </>
    )
}

export default TagsList;