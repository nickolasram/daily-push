import {NextRequest, NextResponse} from "next/server";
import {PushCognitoClass} from "@/classes";
import {getCognitoClient} from "@/globalFunctions/functions";
import {
    AdminAddUserToGroupRequest,
    AdminCreateUserRequest
} from "@aws-sdk/client-cognito-identity-provider";

const restructureName =(input:string)=>{
    const re =  new RegExp(/[\p{L}\p{M}\p{S}\p{N}\p{P}]/u)
    let endValue = input
    for (const character of input.split('')){
        if (!re.test(character)){
            const letterArray = endValue.split(character)
            endValue = letterArray.join('_')
        }
    }
    return endValue
}

export async function GET(){
    try {
        const response = await PushCognitoClass.listAllUsersWithGroups();
        const responseObject = {
            data: response
        }
        const jResponse = JSON.stringify(responseObject)
        return NextResponse.json(jResponse, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error}, {status:500});
    }
}

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    const email = data.get('email') as string;
    const role = data.get('role') as string;
    const validatedName = restructureName(username)
    try {
        const client = await getCognitoClient();

        const input:AdminCreateUserRequest = {
            UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
            TemporaryPassword:password,
            UserAttributes: [
                {
                    Name:'email',
                    Value:email
                },
                {
                    Name:'preferred_username',
                    Value:username
                }
            ],
            Username:validatedName,
        }

        await PushCognitoClass.createUser(
            client,
            input
        )

        const groupInput:AdminAddUserToGroupRequest = {
            UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
            Username:validatedName,
            GroupName:role,
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