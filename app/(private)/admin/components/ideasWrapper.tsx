'use server'

import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {getDynamoClient} from "@/globalFunctions/functions";
import AddIdeasBtn from "@/app/(private)/admin/components/addIdeasBtn";
import {IdeaEditBtn} from "@/app/(private)/admin/components/editBtns";
import {PushIdea} from "@/types";

async function allIdeas() {
    const allIdeas = new QueryCommand({
        TableName: 'daily-push',
        KeyConditionExpression: 'objectType = :pr',
        ExpressionAttributeValues: {
            ':pr': 'idea'
        }
    })
    const client = await getDynamoClient()
    const response = await client.send(allIdeas);
    return response.Items;
}

const IdeasWrapper=async ()=>{
    const ideas = await allIdeas();
    return(
        <>
            {ideas!.length == 0 &&
                <p className={'mb-6'}>No ideas returned.</p>
            }
            {ideas!.length > 0 &&
                <div className="mb-6">
                    {
                        ideas!.map((idea,i) => (
                            <div key={i} className={'flex justify-between py-3 border-b-1 border-b-white last-of-type:border-b-0 gap-6'}>
                                <p>{idea.idea as string}</p>
                                <IdeaEditBtn idea={idea as PushIdea} />
                            </div>
                        ))
                    }
                </div>
            }
            <AddIdeasBtn />
        </>
    )
}

export default IdeasWrapper;