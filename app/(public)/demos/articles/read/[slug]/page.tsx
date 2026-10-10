'use server'

import {getDynamoClient} from "@/globalFunctions/functions";
import {PushCognitoClass, PushDynamoArticle} from "@/classes";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {listAndKVReference, PushArticle} from "@/types";
import PushArticleDisplay from "@/components/pushArticleDisplay";
import {Suspense} from "react";

const KVs:listAndKVReference[] = [
    {
        display: 'Admin',
        value: '1245a',
    }
]

export default async function Page({params}:{params:Promise<{slug: string}>}){
    const {slug} = await params;
    const dynamoClient = await getDynamoClient();
    const articleGet = await PushDynamoArticle.get(dynamoClient, slug)
    const article = articleGet.Item as PushArticle;
    const users = await PushCognitoClass.listAllUsers()
    const usersAsKVs = (users.Users??[]).map(user => {
        const sub = user.Attributes!.find(obj=>obj.Name=='sub')?.Value??'User sub not found'
        if (sub) {
            return {
                display: user.Attributes!.find(obj=>obj.Name=='preferred_username')?.Value??'Username not found',
                value: sub
            }
        }
    })
    return(
        <Suspense fallback={<p>Loading...</p>}>
            { article ?
                <div>
                    <SimpleVertical>
                        <PushArticleDisplay article={article} authorsReference={usersAsKVs} />
                    </SimpleVertical>
                </div> :
                <div><p>Article not Found</p></div>
            }
        </Suspense>
    )
}