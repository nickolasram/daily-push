"use server"
import {PushCognitoClass} from "@/classes";
import {getSession} from "@/session/actions";
import {Suspense} from "react";
import {
    articleAdminFormSettings,
    KVRecord,
    listAndKVReference,
    suggestKVFieldValue
} from "@/types";
import ArticleFormDemoWrapper from "@/app/(public)/demos/articles/articleFormDemoWrapper";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";

const Page=async ()=>{
    const session = await getSession();
    const userPool = await PushCognitoClass.listAllUsers();
    const userPoolSuccess = !!(userPool.Users && userPool.Users.length > 0);
    const userSub = session.sub;
    const adminSettings:articleAdminFormSettings = {
        reference: [],
        suggested: []
    }
    const suggestedKVs:suggestKVFieldValue[] = []
    const kvReferences:listAndKVReference[] = []
    const authorKV:KVRecord = {
        key: 'Author',
        value: userSub??'',
        object:true,
        hidden:false
    }
    if (userSub && userPoolSuccess) {
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
                adminSettings.reference!.push(reference)
                adminSettings.suggested!.push(reference)
            }
        }
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
                        userSub={userSub}
                        adminSettings={adminSettings}
                        suggestedKVs={suggestedKVs}
                        authorKV={authorKV}
                        kvReferences={kvReferences}
                    />
                }
            </Suspense>
        </SimpleVertical>
    )
}

export default Page;