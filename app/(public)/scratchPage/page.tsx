"use client"
import {generateKVRecord, pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import {PushDynamoArticle} from "@/classes";
import {listAndKVReference, KVRecord, suggestKVFieldValue} from "@/types";
import {ArticleForm} from "@/app/components/articleElements";

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
    const scratchArticle = new PushDynamoArticle('Username');
    scratchArticle.setFormSettings({
        suggestedKVs:suggestedKVs,
        kvReference:usersReference,
        providedKVs:KVs
    })
    const formNodes:pushFormNode[] = scratchArticle.formNodes
    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.target);
        const name = 'contributors'
        const kvs = generateKVRecord(name,data)
        console.log(kvs)
    }

    return (
        <div>
            <ArticleForm fields={formNodes} onSubmit={handleSubmit} />
        </div>
    )
}