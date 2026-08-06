'use server'
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {ProjectEditBtn} from "@/app/(private)/admin/components/editBtns";
import {getDynamoClient} from "@/globalFunctions/functions";
import {PushDynamoProject} from "@/models";
import LeftWrapJustifyCenterContainer from "@/app/components/frameworks/leftWrapJustifyCenterContainer";

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
    const tagsRefined = (tagsRaw as {title:string,objectId:string}[]).map(tag =>({value:tag.objectId,display:tag.title}))
    return (
        <>
            { projects!.length == 0 &&
                <p>no projects found</p>
            }
            { projects!.length > 0 &&
                <LeftWrapJustifyCenterContainer>
                    { projects!.map((project,i) => {
                        return (
                            <ProjectEditBtn project={project.plainObject()} nodes={project.formNodes} key={i} tags={tagsRefined} />
                        )
                    })
                    }
                </LeftWrapJustifyCenterContainer>
            }
        </>
    )
}