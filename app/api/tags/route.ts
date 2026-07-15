import {NextResponse, NextRequest} from "next/server";
import {PushDynamoTag} from "@/models";
import {getDynamoClient} from "@/globalFunctions/functions";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = body.data as string;
    try {
        await PushDynamoTag.post(await getDynamoClient(), data)
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

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const data = body.data as string;
    try {
        await PushDynamoTag.delete(await getDynamoClient(), data);
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = body.data as {title:string,objectId:string};
    try {
        await PushDynamoTag.patch(await getDynamoClient(), data.title, data.objectId);
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}