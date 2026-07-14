'use client'

import { PushProject, PushTag} from "@/types";
import {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useState} from "react";
import FormDialogBtn from "@/app/components/formDialogBtn";
import {PushDynamoProject, PushDynamoTag} from "@/models";

export function TagEditBtn ({tag}:{tag:PushTag}){
    const [open, setOpen] = useState(false);

    const formFields:pushFormNode[] =[ {
        type:'text',
        name:'title',
        id:'title',
        defaultValue: tag.title
    }]

    const updateTag = async (event:SubmitEvent<HTMLFormElement>) => {
        const title = PushDynamoTag.formattedFormValues(event.target.value);
        await fetch('/api/tags', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: {
                    title: title,
                    objectId: tag.objectId
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
    return(
        <FormDialogBtn handleSubmit={updateTag} formFields={formFields} dialogTitle={'Update '+tag.title} open={open} setOpen={setOpen}>
            <p>{tag.title}</p>
        </FormDialogBtn>
    )
}

export function ProjectEditBtn({project,nodes,tags}: {project:PushProject,nodes:pushFormNode[],tags:{display:string,value:string}[]}) {
    const [open, setOpen] = useState(false);
    const formNodes = [...nodes];
    formNodes[3].tags = tags;

    const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
        const changes = PushDynamoProject.detectedChanges(event, project)
        if (Object.keys(changes).length == 0){
            setOpen(false);
            return;
        }
        await fetch('/api/projects', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data:{
                    objectId: project.objectId,
                    detectedChanges: changes
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
        <FormDialogBtn formFields={formNodes} handleSubmit={handleSubmit} dialogTitle={project.title} open={open} setOpen={setOpen}>
            <div className={'aspect-square size-45 flex flex-col justify-between'}>
                <p className={'text-left text-lg line-clamp-3 font-bold'}>{project.title}</p>
                <div className={'max-w-full'}>
                    <p className={'text-left'}>{project.date}</p>
                    <p className={'overflow-x-hidden text-left text-nowrap whitespace-nowrap text-ellipsis max-w-full'}>{project.tags.length>0?tagDisplays.join(', '):'[no tags]'}</p>
                </div>
            </div>
        </FormDialogBtn>
    )
}