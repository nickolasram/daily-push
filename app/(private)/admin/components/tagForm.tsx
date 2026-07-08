'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useRef} from "react";

const formNodes:pushFormNode[]=[
    {
        name: 'title',
        type: 'text',
        id: "title",
        label: 'Title',
    },
]

export default function TagForm(){
    const formRef = useRef<HTMLFormElement|null>(null);
    const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const entries:[string,FormDataEntryValue][] =[...data.entries()]
        const entriesNoHL:[string, FormDataEntryValue][] = entries.filter(
            (entry)=>(
                entry[0]=='title'
            )
        )
        const dataObject:Record<string,FormDataEntryValue>={};
        for(const entry of entriesNoHL){
            dataObject[entry[0]] = entry[1];
        }
        await fetch('/api/tags', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data:dataObject
            }),
        }).then(async res => {
            if (res.ok) {
                formRef.current?.reset();
                return res.json()
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }

    return (
        <PushForm fields={formNodes} onSubmit={handleSubmit} ref={formRef} />
    )
}