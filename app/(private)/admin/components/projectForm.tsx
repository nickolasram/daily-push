'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";

const formNodes =(tags:string[]):pushFormNode[]=> ([
        {
            name: 'title',
            type: 'text',
            id: "title",
            label: 'Title',
        },
        {
            name: 'date',
            type: 'date',
            id: "date",
            label: 'Date',
        },
        {
            name: 'missed',
            type: 'check',
            id: "missed",
            label: 'Reason for Missing',
            options: [
                {
                    value: 'away',
                    label: 'Away from Home'
                },
                {
                    value: 'sick',
                    label: 'Sick'
                },
            ]
        },
        {
            type: 'tags',
            name: 'tags',
            id: 'tags',
            tags: tags??[]
        },
        {
            type: 'richTextField',
            name: 'description',
            id: 'description',
            label: 'Description'
        },
    ]
)

const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const entries:[string,FormDataEntryValue][] =[...data.entries()]
    const tags= data.getAll('tags') as string[]
    const entriesNoHL:[string, FormDataEntryValue][] = entries.filter(
        (entry)=>(
            entry[0]!='highlightColor'&&entry[0]!='kvfKey'&&entry[0]!='kvfValue'&&entry[0]!='tags'
        )
    )
    const dataObject:Record<string,FormDataEntryValue|string[]>={};
    for(const entry of entriesNoHL){
        dataObject[entry[0]] = entry[1];
    }
    dataObject.tags = tags;
    await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            data:dataObject
        }),
    }).then(async res => {
        if (res.ok) {
            return res.json()
        } else {
            console.log(res)
            throw new Error(`${res.statusText}`)
        }
    })
}

interface ProjectFormProps{
    tags:string[]
}

export default function ProjectForm({tags}:ProjectFormProps) {
    const fields = formNodes(tags);
    return (
        <PushForm fields={fields} onSubmit={handleSubmit} />
    )
}