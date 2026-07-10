'use server'
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushProject} from "@/types";
import ProjectPreview from "@/app/(private)/admin/components/projectPreview";

async function getProjects() {
    function docClient(){
        const dbClient = new DynamoDBClient({
            credentials:{
                accessKeyId:process.env.NEXT_PUBLIC_ACCESS_KEY as string,
                secretAccessKey:process.env.NEXT_PUBLIC_SECRET_KEY as string
            }
        })
        return DynamoDBDocumentClient.from(dbClient)
    }

    const allProjects = new QueryCommand({
        TableName:'daily-push',
        KeyConditionExpression: 'objectType = :pr',
        ExpressionAttributeValues: {
            ':pr': 'project'
        }
    })

    const response = await docClient().send(allProjects);
    return response.Items;
}

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

export default async function ProjectsList() {
    const projects = await getProjects() as PushProject[];
    const tagsRaw = await getTags();
    const tagsRefined = (tagsRaw as {title:string}[]).map(tag =>tag.title)
    return (
        <>
            { projects!.length == 0 &&
                <p>no projects found</p>
            }
            { projects!.length > 0 &&
                <div className={'max-w-[80svw] flex-wrap flex gap-3 mb-6'}>
                    { projects!.map((project,i) => {
                        return (
                            <ProjectPreview project={project} tags={tagsRefined} key={i} />
                        )
                    })
                    }
                </div>
            }
        </>
    )
}