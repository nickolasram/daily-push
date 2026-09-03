"use client"
import PushForm, {generateKVRecord, pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import {PushDynamoArticle} from "@/classes";
import {defaultKVFieldValues} from "@/types";

const usersReference = [
    { display:'Admin',
        value:'1245a',
    },
    { display:'Admin2',
        value:'1245ab',
    }
]
const KVs = [
    {
        record:{
            key: 'Author',
            value: '1245a',
    },
        object:true
    },
    {
        record:{
            key: 'Research',
            value: 'Michael',
        },
        object:false
    }
]
const suggestedKVs=[
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
    scratchArticle.autoIncludeUser({defaultKey:'[placeholder]',value:'1245ab',reference:true})
    const formNodes:pushFormNode[] = scratchArticle.formNodes

    const altControls = scratchArticle.altControls()

    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.target);
        const name = 'contributors'
        const kvs = generateKVRecord(name,data)
    }

    return (
        <div>
            <PushForm fields={formNodes} onSubmit={handleSubmit} altControls={altControls()} />
        </div>
    )
}