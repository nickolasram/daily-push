'use server'
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {PushProject} from "@/types";

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

export default async function ProjectsList() {
    const projects = await getProjects() as PushProject[];
    return (
        <>
            { projects!.length == 0 &&
                <p>no projects found</p>
            }
            { projects!.length > 0 &&
                <>
                    { projects!.map((project,i) => {
                        return (<p key={i}>{project.title}</p>)
                    })
                    }
                </>
            }
        </>
    )
}