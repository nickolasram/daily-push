import {NextRequest, NextResponse} from "next/server";
import {dynamoObject} from "@/types";
import {getDynamoClient} from "@/globalFunctions/functions";
import {dynamoPutCommandBuilder} from "@/app/api/functions";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = body.data;
    try {
        await dynamoPutCommandBuilder(
            await getDynamoClient(),
            'idea',
            'daily-push',
            data as dynamoObject
        )
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        return NextResponse.json({error: error}, {status:500});
    }
}