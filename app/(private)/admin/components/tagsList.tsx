'use server'

import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushTag} from "@/types";
import {getDynamoClient} from "@/globalFunctions/functions";
import {TagEditBtn} from "@/app/(private)/admin/components/editBtns";

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

const TagsList=async()=>{
    const tags = await getTags() as PushTag[];
    return (
        <>
            { tags!.length == 0 &&
                <p>no projects found</p>
            }
            { tags!.length > 0 &&
                <div className={'editBtnFlexContainer'}>
                    { tags!.map((tag,i) => {
                        return (
                            <TagEditBtn tag={tag} key={i} />
                        )
                    })
                    }
                </div>
            }
        </>
    )
}

export default TagsList;