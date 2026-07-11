import {NextResponse, NextRequest} from "next/server";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {dynamoObject, PushProject} from "@/types";
import {dynamoPutCommandBuilder, dynamoUpdateCommandBuilder} from "@/app/api/functions";


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
        const client = docClient();
        await dynamoPutCommandBuilder(
            client,
            'project',
            'daily-push',
            data as unknown as dynamoObject
        )
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
    const data = body.data as {key:object, updates:dynamoObject};
    try {
        const client = docClient();
        await dynamoUpdateCommandBuilder(
            client,
            'daily-push',
            data.key as dynamoObject,
            data.updates
        )
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status:500});
    }
}