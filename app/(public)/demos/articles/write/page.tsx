"use server"
import {PushCognitoClass, PushDynamoArticle} from "@/classes";
import {getSession} from "@/session/actions";
import {SubmitEvent, Suspense} from "react";
import {articleFormSettings, KVRecord, listAndKVReference, suggestKVFieldValue} from "@/types";
import PushForm from "@/app/components/PushForm";
import ArticleFormDemoWrapper from "@/app/(public)/demos/articles/articleFormDemoWrapper";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";

const Page=async ()=>{
    const session = await getSession();
    const userPool = await PushCognitoClass.listAllUsers();
    const userPoolSuccess = !!(userPool.Users && userPool.Users.length > 0);
    const userSub = session.sub;
    let article:PushDynamoArticle|undefined;
    if (userSub && userPoolSuccess) {
        article = new PushDynamoArticle(userSub)
        const authorKV:KVRecord = {
            key: 'Author',
            value: userSub,
            object:true,
            hidden:false
        }
        const suggestedKVs:suggestKVFieldValue[] = []
        const kvReferences:listAndKVReference[] = []
        for (const user of userPool.Users!) {
            const sub = user.Attributes!.find(obj=>{return obj.Name === 'sub'})
            const pUsername = user.Attributes!.find(obj=>{return obj.Name === 'preferred_username'})
            if(pUsername?.Value&&sub?.Value){
                const reference:suggestKVFieldValue={
                    value:sub.Value,
                    display:pUsername.Value,
                }
                suggestedKVs.push(reference)
                kvReferences.push(reference)
            }
        }
        const articleSettings:articleFormSettings = {
            headingLabel:'Title',
            hideSubheading:false,
            subheadingLabel:'Sub Title',
            hideHeaderImage:false,
            providedKVs: [authorKV],
            suggestedKVs: suggestedKVs,
            kvReference:kvReferences
        }
        article.setFormSettings(articleSettings);
    }

    return (
        <SimpleVertical>
            <Suspense fallback={<p>Loading...</p>}>
                { !userPoolSuccess &&
                    <p>ERROR: Cannot retrieve users list.</p>
                }
                { !userSub &&
                    <p>ERROR: Cannot retrieve user ID.</p>
                }
                { userPoolSuccess && userSub &&
                    <ArticleFormDemoWrapper
                        formNodes={article!.formNodes}
                    />
                }
            </Suspense>
        </SimpleVertical>
    )
}

export default Page;