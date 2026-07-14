import {NextRequest, NextResponse} from "next/server";
import {getDynamoClient} from "@/globalFunctions/functions";
import {PushDynamoIdea} from "@/models";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = body.data as string;
    try {
        await PushDynamoIdea.post(await getDynamoClient(), data);
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = body.data as {idea:string, objectId:string};
    try {
        await PushDynamoIdea.patch(await getDynamoClient(), data.idea, data.objectId);
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}
