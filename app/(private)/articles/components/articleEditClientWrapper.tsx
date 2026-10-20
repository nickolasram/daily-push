"use client"

import {
    articleAdminFormSettings,
    articleFormSettings,
    listAndKVReference,
    PushArticle,
    suggestKVFieldValue
} from "@/types";
import {SubmitEvent, useState} from "react";
import {PushDynamoArticle} from "@/classes";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import ArticleForm from "@/app/components/articleElements";

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
    const router = useRouter();
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
        const btnPressed = article.getControlValue(event)
        const articleString = JSON.stringify(article.plainArticle())
        toast.promise(
            article.handleSubmit(event,article.articleId?articleString??'':undefined),
            {
                loading: `Attempting to ${btnPressed=='save'?'Save':'Publish'} Article...`,
                success: (response) => {
                    if(!response.ok){
                        return 'No Changes Detected'
                    }
                    return `Successfully ${btnPressed=='save'?'Save':'Publish'} Article.`
                },
                error: () => {
                    return `Error ${btnPressed=='save'?'Saving':'Publishing'} Article.`
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
    const handleAdminSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const data = new FormData(event.target);
        const changes = article.getAdminSettingsUpdate(data)
        if (!changes[0]){
            toast.success('No Changes to Update.')
        } else {
            const plainArticle = article.plainArticle();
            const updatedArticle = new PushDynamoArticle(plainArticle);
            updatedArticle.adminSettings = changes[1];
            updatedArticle.setFormSettings(articleSettings);
            updatedArticle.setAdminFormSettings(adminSettings);
            setArticle(updatedArticle);
            toast.promise(
                fetch('/api/articleAdmin', {
                        method:"PATCH",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            articleId: updatedArticle.articleId,
                            adminSettings:changes[1],
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
        }
    }
    const handleDelete = () => {
        toast.promise(
            article.deleteArticle(),
            {
                loading: `Deleting ${article.heading??'Article'}...`,
                success: 'Successfully Deleted Article',
                error: () => {
                    return `Error Deleting Article.`
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
        ).then(() => {
            router.push('/articles/view')
        })
    }
    return (
        <div className="mt-6">
            <ArticleForm
                fields={article.formNodes}
                onSubmit={handleSubmit}
                settingFields={article.adminFormNodes}
                onSettingsSubmit={handleAdminSubmit}
                article={article.plainArticle()}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default ArticleEditClientWrapper;