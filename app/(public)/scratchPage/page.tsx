"use client"
import {generateKVRecord} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import {PushDynamoArticle} from "@/classes";
import {listAndKVReference, KVRecord, suggestKVFieldValue} from "@/types";
import ArticleForm from "@/app/components/articleElements";

const usersReference:listAndKVReference[] = [
    { display:'Admin',
        value:'1245a',
    },
    { display:'Admin2',
        value:'1245ab',
    }
]
const KVs:KVRecord[] = [
    {
        key: 'Author',
        value: '1245a',
        object:true,
        hidden:true
    },
    {
        key: 'Research',
        value: 'Michael',
        object:false,
        hidden:false
    }
]
const suggestedKVs:suggestKVFieldValue[]=[
    'Marcus',
    {
        value:'122nf',
        display:'Tyrus'
    }
]

export default function Page(){
    const scratchArticle = new PushDynamoArticle('1245a');
    scratchArticle.setFormSettings({
        suggestedKVs:suggestedKVs,
        kvReference:usersReference,
    })
    scratchArticle.setAdminSettings({reference:usersReference,suggested:suggestedKVs})
    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        scratchArticle.handleSubmit(event)
    }

    return (
        <div>
            <ArticleForm
                fields={scratchArticle.formNodes}
                onSubmit={handleSubmit}
                settingFields={scratchArticle.adminFormNodes}
                onSettingsSubmit={handleSubmit}
            />
        </div>
    )
}