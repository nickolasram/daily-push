'use client'

import {PushIdea, PushProject, PushTag} from "@/types";
import {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useState} from "react";
import FormDialogBtn from "@/app/components/formDialogBtn";
import {PushDynamoIdea, PushDynamoProject, PushDynamoTag} from "@/models";

export function IdeaEditBtn({idea}:{idea:PushIdea}){
    const [open, setOpen] = useState(false);
    const formFields:pushFormNode[] = [{
        type:'text',
        name:'idea',
        defaultValue:idea.idea,
    }]
    const deleteIdea = async () => {
        const objectId = idea.objectId
        await fetch('/api/ideas', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: objectId
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
    const updateIdea = async (event:SubmitEvent<HTMLFormElement>) => {
        const ideaValue = PushDynamoIdea.formattedFormValues(event);
        await fetch('/api/ideas', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: {
                    idea: ideaValue,
                    objectId: idea.objectId
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
        <FormDialogBtn
            handleSubmit={updateIdea}
            formFields={formFields}
            dialogTitle={'Update Idea'}
            open={open}
            setOpen={setOpen}
            handleDelete={deleteIdea}
            btnStyle={'bg-none border-none text-white'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
        </FormDialogBtn>
    )
}

export function TagEditBtn ({tag}:{tag:PushTag}){
    const [open, setOpen] = useState(false);

    const formFields:pushFormNode[] =[ {
        type:'text',
        name:'title',
        id:'title',
        defaultValue: tag.title
    }]

    const deleteTag = async () => {
        const objectId = tag.objectId
        await fetch('/api/tags', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: objectId
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

    const updateTag = async (event:SubmitEvent<HTMLFormElement>) => {
        const title = PushDynamoTag.formattedFormValues(event);
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
        <FormDialogBtn
            handleSubmit={updateTag}
            formFields={formFields}
            dialogTitle={'Update '+tag.title}
            open={open}
            setOpen={setOpen}
            handleDelete={deleteTag}
        >
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

    const deleteProject = async () => {
        const objectId = project.objectId
        await fetch('/api/projects', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: objectId
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
        <FormDialogBtn
            formFields={formNodes}
            handleSubmit={handleSubmit}
            dialogTitle={project.title}
            open={open}
            setOpen={setOpen}
            handleDelete={deleteProject}
            btnStyle={'neon'}
        >
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