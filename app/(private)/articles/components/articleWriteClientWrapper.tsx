"use client"

import {SubmitEvent, useState} from "react";
import ArticleForm from "@/app/components/articleElements";
import {
    articleAdminFormSettings,
    articleAdminSettings,
    articleAdminUser,
    articleFormSettings,
    KVRecord,
    listAndKVReference,
    suggestKVFieldValue
} from "@/types";
import {PushDynamoArticle} from "@/classes";
import toast from "react-hot-toast";
import {PushDynamoTag} from "@/models";
import {getDynamoClient} from "@/globalFunctions/functions";
import {useRouter} from "next/navigation";

interface props{
    userSub:string;
    adminSettings:articleAdminFormSettings;
    suggestedKVs:suggestKVFieldValue[];
    kvReferences:listAndKVReference[]
    authorKV:KVRecord;
}

const ArticleWriteClientWrapper=({userSub,adminSettings,suggestedKVs,kvReferences,authorKV}:props)=>{
    const freshArticle = new PushDynamoArticle(userSub);
    const articleSettings:articleFormSettings = {
        headingLabel:'Title',
        hideSubheading:false,
        subheadingLabel:'Sub Title',
        hideHeaderImage:false,
        providedKVs: [authorKV],
        suggestedKVs: suggestedKVs,
        kvReference:kvReferences
    }
    freshArticle.setFormSettings(articleSettings);
    freshArticle.setAdminFormSettings(adminSettings);
    const [article,setArticle] = useState(freshArticle);
    const router = useRouter();
    const handleSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const btnPressed = article.getControlValue(event)
        toast.promise(
            article.handleSubmit(event),
            {
                loading: `Attempting to ${btnPressed=='save'?'Save':'Publish'} Article...`,
                success: `Successfully ${btnPressed=='save'?'Save':'Publish'} Article.`,
                error: () => {
                    return `Error ${btnPressed=='save'?'Save':'Publish'} Article.`
                },
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                },
                error: {
                    duration: 500,
                }
            }
        ).then(result => {
            router.push("/articles/"+result.statusText+'/edit');
        })
    }
    const handleSettingsSubmit=async (event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        const data = new FormData(event.target);
        const creatorSetting = article.adminSettings.admins.find(obj=>{return obj.permission == 'creator'}) as articleAdminUser
        const newAdminUserSettings = PushDynamoArticle.getNewAdminSettings(data,creatorSetting);
        const plainArticle = article.plainArticle();
        const updatedArticle = new PushDynamoArticle(plainArticle);
        updatedArticle.adminSettings.admins = newAdminUserSettings;
        const newAdminSettingsWithTags:articleAdminSettings = {
            admins:newAdminUserSettings
        }
        const newArticleAdminFormSettings = {
            ...adminSettings
        }
        if (article.adminFormNodes.find(object=>object.type == 'freeTags') || article.adminFormNodes.find(object=>object.type == 'tags')){
            const inputTags = data.getAll('ArticleTags') as string[];
            let articleTags = article.adminSettings.tags?[...article.adminSettings.tags]:[];
            for (const tag of inputTags){
                if (!articleTags.includes(tag)){
                    articleTags.push(tag);
                }
            }
            const newTags = data.getAll('ArticleTagsNew')
            if(newTags.length > 0){
                try {
                    const client = await getDynamoClient();
                    const newIDs = await PushDynamoTag.genIDs(newTags.length, client)
                    await PushDynamoTag.batchWriteGivenIDs(
                        client,
                        'daily-push',
                        newTags as string[],
                        newIDs,
                        'article'
                    )
                    articleTags = [...articleTags,...newIDs]
                } catch{
                    toast.error(`Error while creating new tags`);
                    return
                }
            }
            newAdminSettingsWithTags.tags = articleTags
            newArticleAdminFormSettings.tagsReference = await PushDynamoTag.getCategoryTags('daily-push', 'article');
        }
        updatedArticle.adminSettings = newAdminSettingsWithTags;
        updatedArticle.setFormSettings(articleSettings);
        updatedArticle.setAdminFormSettings(adminSettings);
        setArticle(updatedArticle);
        toast.success("Updated Admin");
    }
    return(
        <div className="mt-6">
            <ArticleForm
                fields={article.formNodes}
                onSubmit={handleSubmit}
                settingFields={article.adminFormNodes}
                onSettingsSubmit={handleSettingsSubmit}
            />
        </div>
    )
}

export default ArticleWriteClientWrapper;