"use client"

import {SubmitEvent, useState} from "react";
import ArticleForm from "@/app/components/articleElements";
import {
    articleAdminSetting,
    articleAdminFormSettings,
    articleFormSettings,
    KVRecord,
    listAndKVReference,
    suggestKVFieldValue
} from "@/types";
import {PushDynamoArticle} from "@/classes";
import toast from "react-hot-toast";

interface props{
    userSub:string;
    adminSettings:articleAdminFormSettings;
    suggestedKVs:suggestKVFieldValue[];
    kvReferences:listAndKVReference[]
    authorKV:KVRecord;
}

const ArticleFormDemoWrapper=({userSub,adminSettings,suggestedKVs,kvReferences,authorKV}:props)=>{
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
        )
    }
    const handleSettingsSubmit=async (event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        const data = new FormData(event.target);
        const creatorSetting = article.adminSettings.find(obj=>{return obj.permission == 'creator'}) as articleAdminSetting
        const newAdminSettings = PushDynamoArticle.getNewAdminSettings(data,creatorSetting);
        const plainArticle = article.plainArticle();
        const updatedArticle = new PushDynamoArticle(plainArticle);
        updatedArticle.adminSettings = newAdminSettings;
        updatedArticle.setFormSettings(articleSettings);
        updatedArticle.setAdminFormSettings(adminSettings);
        setArticle(updatedArticle);
        if(updatedArticle.lastSavedDate&&updatedArticle.articleId){
            toast.promise(
                fetch('/api/articleAdmin', {
                        method:"PATCH",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            articleId: updatedArticle.articleId,
                            adminSettings:newAdminSettings,
                        }),
                    }
                ),
                {
                    loading: `Attempting to Update Perms...`,
                    success: `Successfully Updated Perms...`,
                    error: () => {
                        return `Error Updating Perms...`
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
            )
        } else {
            toast.success("Updated Admin Perms.");
        }
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