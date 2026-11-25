import {NextRequest, NextResponse} from "next/server";
import {PushDynamoArticle} from "@/classes";
import {articleAdminSettings} from "@/types";
import {getDynamoClient} from "@/globalFunctions/functions";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    try {
        const client = await getDynamoClient()
        const articleId = body.articleId as string;
        const newAdminSettings = body.adminSettings as articleAdminSettings;
        await PushDynamoArticle.handleSettingsSubmitPatch(
            client,
            articleId,
            newAdminSettings
        )
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error}, {status:500});
    }

}