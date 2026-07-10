'use client'

import {useState, SubmitEvent} from "react";
import {Button, Dialog, DialogPanel} from "@headlessui/react";
import {PushTag} from "@/types";
import PushForm, {pushFormNode} from "@/app/components/PushForm";


interface TagEditBtnProps {
    tag: PushTag;
}

// TODO: Refresh tags when updated

const TagEditBtn=({tag}:TagEditBtnProps)=>{
    const [open,setOpen]=useState(false)
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

    return (
        <>
            <Button
                className={'border-gray-600 bg-gray-100 text-gray-600'}
                onClick={()=>setOpen(!open)}
            >
                {tag.title}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4  backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className="max-w-lg text-black py-10 min-w-xs space-y-1 flex flex-col justify-between bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className={'text-lg px-6'}>Update {tag.title}</p>
                            <Button
                                onClick={()=>setOpen(false)}
                                className={'text-black border-none pr-6'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </div>
                        <PushForm fields={formFields} onSubmit={updateTag} />
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default TagEditBtn;