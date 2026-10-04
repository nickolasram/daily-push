import {NextRequest, NextResponse} from "next/server";
import {PushCognitoClass} from "@/classes";
import {getCognitoClient} from "@/globalFunctions/functions";
import {
    AdminAddUserToGroupRequest,
    AdminCreateUserRequest
} from "@aws-sdk/client-cognito-identity-provider";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const username = data.get('username');
    const password = data.get('password');
    const email = data.get('email');
    const role = data.get('role');
    try {
        const client = await getCognitoClient();

        const input:AdminCreateUserRequest = {
            UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
            TemporaryPassword:password as string,
            UserAttributes: [
                {
                    Name:'email',
                    Value:email as string
                }
            ],
            Username:username as string,
        }

        await PushCognitoClass.createUser(
            client,
            input
        )

        const groupInput:AdminAddUserToGroupRequest = {
            UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
            Username:username as string,
            GroupName:role as string,
        }
        await PushCognitoClass.assignUserToGroup(
            client,
            groupInput
        )
        return NextResponse.json({success: true}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error}, {status:500});
    }
}