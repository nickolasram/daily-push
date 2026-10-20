import {NextRequest, NextResponse} from "next/server";
import {PushDynamoArticle} from "@/classes";

export async function POST(req: NextRequest) {
    try {
        await PushDynamoArticle.post(req)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await PushDynamoArticle.patch(req)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await PushDynamoArticle.delete(req)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}
