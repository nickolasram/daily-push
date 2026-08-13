'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useState} from "react";
import {Button, Dialog, DialogPanel} from "@headlessui/react";
import {PushDynamoProject} from "@/models";

const formNodes =(tags:{display:string,value:string}[]):pushFormNode[]=> ([
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

interface ProjectFormProps{
    tags:{display:string,value:string}[]
}

export default function ProjectForm({tags}:ProjectFormProps) {
    const [open, setOpen] = useState(false);
    const fields = formNodes(tags);
    const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
        const dataObject = PushDynamoProject.formattedFormValues(event)
        await fetch('/api/projects', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data:dataObject
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

    return (
        <>
            <Button
                className={'size-45 aspect-square border-dashed border-white gap-1 justify-center items-center flex'}
                onClick={()=>setOpen(!open)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>
                <p>
                    New Project
                </p>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center   backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className=" text-black py-10 min-w-xs space-y-1 flex flex-col justify-between bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className={'text-lg px-6'}>New Project</p>
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
                            <PushForm fields={fields} onSubmit={handleSubmit} />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}