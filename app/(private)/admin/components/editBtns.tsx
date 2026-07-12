'use client'

import {dynamoObject, PushProject, PushTag} from "@/types";
import {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useState} from "react";
import FormDialogBtn from "@/app/components/formDialogBtn";
import {compareChanges} from "@/app/(private)/admin/functions/adminFunctions";

export function TagEditBtn ({tag}:{tag:PushTag}){
    const [open, setOpen] = useState(false);

    const formFields:pushFormNode[] =[ {
        type:'text',
        name:'title',
        id:'title',
        defaultValue: tag.title
    }]

    const updateTag = async (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const newTag = {
            ...tag,
            title: title
        }
        await fetch('/api/tags', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data:newTag
            }),
        }).then(async res => {
            if (res.ok) {
                setOpen(false);
                return res.json()
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }
    return(
        <FormDialogBtn handleSubmit={updateTag} formFields={formFields} dialogTitle={'Update '+tag.title} open={open} setOpen={setOpen}>
            <p>{tag.title}</p>
        </FormDialogBtn>
    )
}

export function ProjectEditBtn({project,tags}: {project:PushProject,tags:{display:string,value:string}[]}) {
    const [open, setOpen] = useState(false);
    const formFields:pushFormNode[] =[
        {
            name: 'title',
            type: 'text',
            id: "title",
            label: 'Title',
            defaultValue: project.title
        },
        {
            name: 'date',
            type: 'date',
            id: "date",
            label: 'Date',
            defaultValue: project.date
        },
        {
            name: 'missed',
            type: 'check',
            id: "missed",
            label: 'Reason for Missing',
            options: [
                {
                    value: 'away',
                    label: 'Away from Home',
                    defaultChecked: project.away??false
                },
                {
                    value: 'sick',
                    label: 'Sick',
                    defaultChecked: project.sick??false
                },
            ]
        },
        {
            type: 'tags',
            name: 'tags',
            id: 'tags',
            tags: tags??[],
            defaultTags:project.tags
        },
        {
            type: 'richTextField',
            name: 'description',
            id: 'description',
            label: 'Description',
            defaultValue: project.description
        },
    ]
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
        const dataObject:dynamoObject={};
        for(const entry of entriesNoHL){
            dataObject[entry[0]] = entry[1];
        }
        dataObject.tags = tags;
        const changes = compareChanges(dataObject as unknown as PushProject, project)
        if (Object.keys(changes).length == 0){
            setOpen(false);
            return;
        }
        await fetch('/api/projects', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data:{
                    key: {
                        objectType:project.objectType,
                        objectId:project.objectId
                    },
                    updates: changes
                }
            }),
        }).then(async res => {
            if (res.ok) {
                setOpen(false);
                return res.json()
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }
    const tagDisplays = (project.tags??[]).map((tag)=>(tags.find(obj=>obj.value==tag)!.display))
    return(
        <FormDialogBtn formFields={formFields} handleSubmit={handleSubmit} dialogTitle={project.title} open={open} setOpen={setOpen}>
            <div className={'aspect-square size-45 flex flex-col justify-between'}>
                <p className={'text-left text-lg line-clamp-3 font-bold'}>{project.title}</p>
                <div className={'max-w-full'}>
                    <p className={'text-left'}>{project.date}</p>
                    <p className={'overflow-x-hidden text-left text-nowrap whitespace-nowrap text-ellipsis max-w-full'}>{project.tags?tagDisplays.join(', '):'[no tags]'}</p>
                </div>
            </div>
        </FormDialogBtn>
    )
}