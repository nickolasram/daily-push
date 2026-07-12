'use server'
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushProject} from "@/types";
import {ProjectEditBtn} from "@/app/(private)/admin/components/editBtns";
import {getDynamoClient} from "@/globalFunctions/functions";

async function getProjects() {
    const allProjects = new QueryCommand({
        TableName:'daily-push',
        KeyConditionExpression: 'objectType = :pr',
        ExpressionAttributeValues: {
            ':pr': 'project'
        }
    })
    const client = await getDynamoClient()
    const response = await client.send(allProjects);
    return response.Items;
}

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

export default async function ProjectsList() {
    const projects = await getProjects() as PushProject[];
    const tagsRaw = await getTags();
    const tagsRefined = (tagsRaw as {title:string,objectId:string}[]).map(tag =>({value:tag.objectId,display:tag.title}))
    return (
        <>
            { projects!.length == 0 &&
                <p>no projects found</p>
            }
            { projects!.length > 0 &&
                <div className={'editBtnFlex'}>
                    { projects!.map((project,i) => {
                        return (
                            <ProjectEditBtn project={project} key={i} tags={tagsRefined} />
                        )
                    })
                    }
                </div>
            }
        </>
    )
}