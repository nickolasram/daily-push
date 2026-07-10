'use client'
import {PushProject} from "@/types";
import {Button, Dialog, DialogPanel} from "@headlessui/react";
import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {useState, SubmitEvent} from "react";
import {compareChanges} from "@/app/(private)/admin/functions/adminFunctions";

interface ProjectPreviewProps {
    project:PushProject;
    tags:string[];
}

const ProjectPreview=({project,tags}:ProjectPreviewProps)=>{
    const [open, setOpen] = useState(false);
    const formNodes:pushFormNode[] =[
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
        const dataObject:Record<string,FormDataEntryValue|string[]>={};
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

    return(
        <>
            <Button
                className={'aspect-square p-4 bg-gray-100 border-gray-600 text-gray-600 size-45 flex flex-col justify-between items-start'}
                onClick={()=>setOpen(true)}
            >
                <p className={'text-left text-lg line-clamp-3 font-bold'}>{project.title}</p>
                <div className={'max-w-full'}>
                    <p className={'text-left'}>{project.date}</p>
                    <p className={'overflow-x-hidden text-nowrap whitespace-nowrap text-ellipsis max-w-full'}>{project.tags.join(', ')}</p>
                </div>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4  backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className="text-black py-10 min-w-xs space-y-1 flex flex-col justify-between bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className={'text-lg px-6'}>Update {project.title}</p>
                            <Button
                                onClick={()=>setOpen(false)}
                                className={'text-black border-none pr-6'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </div>
                        <div className={'max-h-[70vh] overflow-y-scroll'}>
                            <PushForm fields={formNodes} onSubmit={handleSubmit} />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default ProjectPreview;