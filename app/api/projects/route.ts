import {NextResponse, NextRequest} from "next/server";
import {dynamoObject, PushProject} from "@/types";
import {PushDynamoProject} from "@/models";
import {getDynamoClient} from "@/globalFunctions/functions";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = body.data as PushProject;
    try {
        await PushDynamoProject.post(await getDynamoClient(), data)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = body.data as {objectId:string, detectedChanges:dynamoObject};
    try {
        await PushDynamoProject.patch(
            await getDynamoClient(),
            data.detectedChanges,
            data.objectId
            )
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status:500});
    }
}