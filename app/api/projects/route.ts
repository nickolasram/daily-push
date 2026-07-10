import {NextResponse, NextRequest} from "next/server";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {PushProject} from "@/types";
import { v4 as uuidv4 } from 'uuid';


function docClient(){
    const dbClient = new DynamoDBClient({
        credentials:{
            accessKeyId:process.env.NEXT_PUBLIC_ACCESS_KEY as string,
            secretAccessKey:process.env.NEXT_PUBLIC_SECRET_KEY as string
        }
    })
    return DynamoDBDocumentClient.from(dbClient)
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = body.data as PushProject;
    try {
        let newId = uuidv4();
        const objectType = 'project';
        const table = 'daily-push';

        // Verify no other object has this ID
        let getCommand = new GetCommand({
            TableName: table,
            Key: {
                objectType: objectType,
                objectId: newId,
            },
        })
        let foundProject = await docClient().send(getCommand);
        while(foundProject.Item){
            newId = uuidv4();
            getCommand = new GetCommand({
                TableName: table,
                Key: {
                    objectType: objectType,
                    objectId: newId,
                },
            })
            foundProject = await docClient().send(getCommand);
        }

        const newItem:PushProject={
            ...data,
            objectType: "project",
            objectId:newId,
            away:data.away??false,
            sick:data.sick??false
        }

        const putCommand = new PutCommand({
            TableName: 'daily-push',
            Item: newItem
        })

        await docClient().send(putCommand);

        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

// export async function PUT(req: NextRequest, res: NextResponse) {
//
// }
//
// export async function GET(req: NextRequest, res: NextResponse) {
//
// }
//
// export async function DELETE(req: NextRequest, res: NextResponse) {
//
// }
//
export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = body.data as {key:object, updates:Record<string, string|number|FormDataEntryValue|object|boolean>};
    const setCommands = [];
    const eav:Record<string, string|number|FormDataEntryValue|object|boolean> = {}
    const keys = Object.keys(data.updates);
    let updateDate = false;
    for (const key of keys) {
        if (key == 'date'){
            updateDate = true;
        }
        setCommands.push(`${key=='date'?'#d':key} = :${key}`);
        eav[`:${key}`] = data.updates[key];
    }
    const fullSetCommand = `SET ${setCommands.join(', ')}`
    try {
        const command = new UpdateCommand({
            TableName: 'daily-push',
            Key: data.key,
            UpdateExpression: fullSetCommand,
            ExpressionAttributeValues: eav,
            ExpressionAttributeNames: updateDate?{'#d':'date'}:undefined
        });
        await docClient().send(command);
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status:500});
    }
}