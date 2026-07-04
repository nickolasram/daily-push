import {NextResponse} from "next/server";
import {
    CognitoUserPool,
    CognitoUser,
} from 'amazon-cognito-identity-js';
import {getSession, logout} from "@/session/actions";

export async function POST(){
    try{
        const session = await getSession();
        const username = session.username as string;
        const poolData = {
            UserPoolId: process.env.AWS_USER_POOL_ID as string,
            ClientId: process.env.AWS_CLIENT_ID as string,
        }
        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: username,
            Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.signOut();
        await logout();
        return NextResponse.json({success: true}, {status:200});
    } catch (err) {
        return NextResponse.json({error: err}, {status:500});
    }
}