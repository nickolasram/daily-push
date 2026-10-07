"use client"

import {SubmitEvent} from "react";
import ArticleForm from "@/app/components/articleElements";
import {articleAdminSettings, articleFormSettings, KVRecord, listAndKVReference, suggestKVFieldValue} from "@/types";
import {PushDynamoArticle} from "@/classes";

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
    const handleSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        alert('submitted')
    }
    const handleSettingsSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        alert('submitted settings')
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

export default ArticleFormDemoWrapper;