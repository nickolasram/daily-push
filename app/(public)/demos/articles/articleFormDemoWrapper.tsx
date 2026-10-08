"use client"

import {SubmitEvent, useState} from "react";
import ArticleForm from "@/app/components/articleElements";
import {
    articleAdminSetting,
    articleAdminSettings,
    articleFormSettings,
    KVRecord,
    listAndKVReference,
    suggestKVFieldValue
} from "@/types";
import {PushDynamoArticle} from "@/classes";
import {generateListFieldValues} from "@/app/components/PushForm";

interface props{
    userSub:string;
    adminSettings:articleAdminSettings;
    suggestedKVs:suggestKVFieldValue[];
    kvReferences:listAndKVReference[]
    authorKV:KVRecord;
}

const ArticleFormDemoWrapper=({userSub,adminSettings,suggestedKVs,kvReferences,authorKV}:props)=>{
    const article = new PushDynamoArticle(userSub);
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
    article.setAdminSettings(adminSettings);
    // const [article,setArticle] = useState(newArticle);
    const handleSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        alert('submitted')
    }
    const handleSettingsSubmit=async (event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        const data = new FormData(event.target);
        const creatorSetting = article.adminSettings.find(obj=>{return obj.permission == 'creator'}) as articleAdminSetting
        const newAdminSettings = PushDynamoArticle.getNewAdminSettings(data,creatorSetting);
        // const updatedArticle = new PushDynamoArticle(article)
        // article.adminSettings = newAdminSettings;
        // TODO: Come up with a way to update the article in memory
        if(article.lastSavedDate&&article.articleId){
            fetch('/api/articleAdmin', {
                method:"PATCH",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        articleId: article.articleId,
                        adminSettings:newAdminSettings,
                    }),
                }
                )
        }
    }
    // console.log(article.adminFormNodes);
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

export default ArticleFormDemoWrapper;