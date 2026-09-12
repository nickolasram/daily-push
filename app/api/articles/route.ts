import {NextRequest, NextResponse} from "next/server";
import {PushDynamoArticle} from "@/classes";

export async function POST(req: NextRequest) {
    try {
        PushDynamoArticle.post(req)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}