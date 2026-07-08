'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";

const formNodes:pushFormNode[] = [
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
                value:'away',
                label: 'Away from Home'
            },
            {
                value:'sick',
                label: 'Sick'
            },
        ]
    },
    {
        type:'richTextField',
        name:'description',
        id: 'description',
        label: 'Description'
    },
]

const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const entries:[string,FormDataEntryValue][] =[...data.entries()]
    const entriesNoHL:[string, FormDataEntryValue][] = entries.filter(
        (entry)=>(
            entry[0]!='highlightColor'&&entry[0]!='kvfKey'&&entry[0]!='kvfValue'
        )
    )
    const dataObject:Record<string,any>={};
    for(const entry of entriesNoHL){
        dataObject[entry[0]] = entry[1];
    }
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

export default function ProjectForm(){
    return (
        <PushForm fields={formNodes} onSubmit={handleSubmit} />
    )
}