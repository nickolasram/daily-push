import {NextRequest, NextResponse} from "next/server";
import {PushDynamoArticle} from "@/classes";

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const image = body.image as string;
    const id = body.id as string;
    try {
        await PushDynamoArticle.deleteHeaderFromS3(image,id)
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}
