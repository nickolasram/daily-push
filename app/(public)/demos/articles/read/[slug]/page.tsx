'use server'

import {getDynamoClient} from "@/globalFunctions/functions";
import {PushDynamoArticle} from "@/classes";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {listAndKVReference, PushArticle} from "@/types";
import PushArticleDisplay from "@/components/pushArticleDisplay";

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
    if(!article){
        return (
            <div><p>Article not Found</p></div>
        )
    }
    return(
        <div>
            <SimpleVertical>
                <PushArticleDisplay article={article} authorsReference={KVs} />
            </SimpleVertical>
        </div>
    )
}