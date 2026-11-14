"use client"

import {PushTag} from "@/types";
import {SubmitEvent} from "react";
import PushForm, {pushFormNode} from "@/app/components/PushForm";

interface props{
    loadedTags: PushTag[];
}

const ClientScratchForm=({loadedTags}:props)=>{
    const fields:pushFormNode[]=[
        {
            type:'freeTags',
            defaultTags:[],
            name:'Article Tags',
            tags:loadedTags.map(tag=>({display:tag.title, value:tag.objectId}))
        }
    ]
    const handleSubmit=(e:SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log('dsa');
    }
    return(
        <div>
            <PushForm
                fields={fields}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default ClientScratchForm;