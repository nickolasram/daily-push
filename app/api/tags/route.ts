import {NextResponse, NextRequest} from "next/server";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {PushTag} from "@/types";
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
    const data = body.data as PushTag;
    try {

        let newId = uuidv4();
        const objectType = 'tag';
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

        const newItem:PushTag={
            ...data,
            objectType: "tag",
            objectId:newId,
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
    const data = body.data as PushTag;
    try {
        const command = new UpdateCommand({
            TableName: 'daily-push',
            Key: {
                objectType: data.objectType,
                objectId: data.objectId,
            },
            UpdateExpression: "SET title = :nt",
            ExpressionAttributeValues: {
                ":nt": data.title,
            }
        });
        await docClient().send(command)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}