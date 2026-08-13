import {NextResponse, NextRequest} from "next/server";
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import {getSession} from "@/session/actions";

interface potentialResult{
    idToken?:string;
}

interface returnError{
    code:string;
    name:string;
}

function asyncAuthentication(cognitoUser:CognitoUser, authDetails: AuthenticationDetails) {
    return new Promise((resolve,reject)=>{
        cognitoUser.authenticateUser(authDetails,{
            onSuccess: resolve,
            onFailure: reject
        })
    })
}

export async function POST(req: NextRequest){
    try{
        const {username, password} = await req.json();
        const authData = {
            Username: username,
            Password: password,
        }
        const authDetails = new AuthenticationDetails(authData);
        const poolData = {
            UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
            ClientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
        }
        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: username,
            Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData);
        const result:potentialResult = await asyncAuthentication(cognitoUser, authDetails) as potentialResult;
        if ('idToken' in result) {
            const session = await getSession();
            session.isLoggedIn = true;
            session.username = username;
            await session.save();
        } else {
            NextResponse.json({error: result}, {status:500});
        }
        return NextResponse.json({success: true}, {status:200});
    } catch (err) {
        if ((err as returnError).name == 'NotAuthorizedException') {
            return NextResponse.json({error: err}, {status:501, statusText: 'Incorrect username or password.'});
        }
        return NextResponse.json({error: err}, {status:500});
    }
}