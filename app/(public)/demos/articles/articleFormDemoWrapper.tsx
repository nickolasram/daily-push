"use client"

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";

interface props{
    formNodes:pushFormNode[];
}

const ArticleFormDemoWrapper=({formNodes}:props)=>{
    const handleSubmit=(event: SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        alert('submitted')
    }
    return(
        <PushForm
            fields={formNodes}
            onSubmit={handleSubmit}
        />
    )
}

export default ArticleFormDemoWrapper;