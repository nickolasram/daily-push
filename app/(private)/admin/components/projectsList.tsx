'use server'
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {getDynamoClient} from "@/globalFunctions/functions";
import {PushDynamoProject} from "@/models";
import SortedProjectList from "@/app/(private)/admin/components/sortedProjectList";

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
    const projects = await PushDynamoProject.getAllProjects()

    const tagsRaw = await getTags();
    const tagsRefined = (tagsRaw as {title:string,objectId:string}[]).map(tag =>({value:tag.objectId.toString(),display:tag.title}))
    return (
        <>
            { projects!.length == 0 &&
                <p>no projects found</p>
            }
            { projects!.length > 0 &&
                <SortedProjectList projects={projects.map(project => {
                    return project.plainObject();
                })}
                   tags={tagsRefined} />
            }
        </>
    )
}