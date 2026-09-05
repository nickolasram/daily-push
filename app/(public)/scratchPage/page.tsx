"use client"
import PushForm, {generateKVRecord, pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import {PushDynamoArticle} from "@/classes";
import {providedKVFieldValues, KVRecord, KVReference, suggestKVFieldValue} from "@/types";

const usersReference:KVReference[] = [
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
    const scratchArticle = new PushDynamoArticle();
    scratchArticle.setDefaultKVs(KVs);
    scratchArticle.setKVReference(usersReference)
    scratchArticle.autoIncludeUser({defaultKey:'[username]',value:'1245ab',reference:true})
    scratchArticle.setSuggestedKVs(suggestedKVs)
    const formNodes:pushFormNode[] = scratchArticle.formNodes

    const altControls = scratchArticle.altControls()

    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.target);
        const name = 'contributors'
        const kvs = generateKVRecord(name,data)
        console.log(kvs)
    }

    return (
        <div>
            <PushForm fields={formNodes} onSubmit={handleSubmit} altControls={altControls()} />
        </div>
    )
}