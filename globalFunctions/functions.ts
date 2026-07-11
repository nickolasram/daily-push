import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function getDynamoClient() {
    const dbClient = new DynamoDBClient({
        credentials:{
            accessKeyId:process.env.NEXT_PUBLIC_ACCESS_KEY as string,
            secretAccessKey:process.env.NEXT_PUBLIC_SECRET_KEY as string
        }
    })
    return DynamoDBDocumentClient.from(dbClient)
}