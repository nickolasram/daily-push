"use client"

import {
    articleAdminFormSettings,
    articleFormSettings,
    listAndKVReference,
    PushArticle,
    suggestKVFieldValue
} from "@/types";
import {SubmitEvent, useState} from "react";
import ArticleForm from "@/app/components/articleElements";
import {PushDynamoArticle} from "@/classes";

interface props{
    kvReferences:listAndKVReference[]
    passedArticle:PushArticle;
    suggestedKVs:suggestKVFieldValue[];
}

const ArticleEditClientWrapper=(
    {
        kvReferences,passedArticle,suggestedKVs
    }
    :props
)=>{
    const freshArticle = new PushDynamoArticle(passedArticle);
    const articleSettings:articleFormSettings = {
        suggestedKVs: suggestedKVs,
        kvReference:kvReferences
    }
    const adminSettings:articleAdminFormSettings = {
        reference: kvReferences,
        suggested: suggestedKVs
    }
    freshArticle.setFormSettings(articleSettings);
    freshArticle.setAdminFormSettings(adminSettings);
    const [article,setArticle] = useState(freshArticle);
    const handleSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault();
        alert('submitted');
    }
    const handleAdminSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault();
        alert('admin submitted');
    }
    return (
        <div className="mt-6">
            <ArticleForm
                fields={article.formNodes}
                onSubmit={handleSubmit}
                settingFields={article.adminFormNodes}
                onSettingsSubmit={handleAdminSubmit}
            />
        </div>
    )
}

export default ArticleEditClientWrapper;