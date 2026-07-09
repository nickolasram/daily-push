'use server'

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushTag} from "@/types";
import TagEditBtn from "@/app/(private)/admin/components/tagEditBtn";

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
    const tags = await getTags() as PushTag[];
    return (
        <>
            { tags!.length == 0 &&
                <p>no projects found</p>
            }
            { tags!.length > 0 &&
                <div className={'max-w-[80svw] flex-wrap flex gap-3 mb-6'}>
                    { tags!.map((tag,i) => {
                        return (<TagEditBtn tag={tag} key={i} />)
                    })
                    }
                </div>
            }
        </>
    )
}

export default TagsList;