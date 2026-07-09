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
                    <DialogPanel className="max-w-lg text-black py-10 min-w-xs space-y-4 flex flex-col justify-between bg-white">
                        <p className={'text-lg px-6'}>Update {tag.title}</p>
                        <PushForm fields={formFields} onSubmit={updateTag} />
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default TagEditBtn;