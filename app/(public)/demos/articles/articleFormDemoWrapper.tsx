"use client"

import {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import ArticleForm from "@/app/components/articleElements";

interface props{
    formNodes:pushFormNode[];
    settingNodes:pushFormNode[];
}

const ArticleFormDemoWrapper=({formNodes,settingNodes}:props)=>{
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
                fields={formNodes}
                onSubmit={handleSubmit}
                settingFields={settingNodes}
                onSettingsSubmit={handleSettingsSubmit}
            />
        </div>
    )
}

export default ArticleFormDemoWrapper;