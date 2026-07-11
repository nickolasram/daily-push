'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent, useState} from "react";
import {Dialog, DialogPanel, Button} from "@headlessui/react";
import {dynamoObject} from "@/types";

const formNodes:pushFormNode[]=[
    {
        name: 'title',
        type: 'text',
        id: "title",
        label: 'Title',
    },
]

export default function TagForm(){
    const [open, setOpen] = useState(false);
    const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const entries:[string,FormDataEntryValue][] =[...data.entries()]
        const entriesNoHL:[string, FormDataEntryValue][] = entries.filter(
            (entry)=>(
                entry[0]=='title'
            )
        )
        const dataObject:dynamoObject={};
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
                type={'button'} onClick={() => setOpen(true)}
                className="ghostAddBtn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>
                <p>Add Tag</p>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4  backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className="max-w-lg text-black py-10 min-w-xs space-y-1 flex flex-col justify-between bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className={'text-lg px-6'}>New Tag</p>
                            <Button
                                onClick={()=>setOpen(false)}
                                className={'text-black border-none pr-6'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </div>
                        <PushForm fields={formNodes} onSubmit={handleSubmit}/>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}