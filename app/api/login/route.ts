import {NextResponse, NextRequest} from "next/server";
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';

export async function POST(req: NextRequest){
    try{
        // const session = await getSession();
        const {username, password} = await req.json();
        const authData = {
            Username: username,
            Password: password,
        }
        const authDetails = new AuthenticationDetails(authData);
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
        cognitoUser.authenticateUser(authDetails,{
            onSuccess: function(result){
                const accessToken = result.getAccessToken().getJwtToken();
                console.log(accessToken);
            },
            onFailure: function(err){
                console.log(err.message || JSON.stringify(err));
            }
        });
        console.log(username, password);
        return NextResponse.json({success: true}, {status:200});
    } catch (err) {
        return NextResponse.json({error: err}, {status:500});
    }
}