'use client'
import {useState,SubmitEvent} from "react";
import BtnPopup from "@/app/components/btnPopup";
import GhostAddBtn from "@/app/(private)/admin/components/ghostAddBtn";
import PopupForm from "@/app/components/popupForm";
import {pushFormNode} from "@/app/components/PushForm";
import {PushDynamoIdea} from "@/models";

const formFields:pushFormNode[]=[
    {
        name:'idea',
        id:'idea',
        type:'text'
    }
]

export default function AddIdeasBtn(){
    const [open, setOpen] = useState(false);
    const handleSubmit = async(e:SubmitEvent<HTMLFormElement>) => {
        const idea = PushDynamoIdea.formattedFormValues(e) as string;
        await fetch('/api/ideas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: idea
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
        <BtnPopup>
            <BtnPopup.Btn>
                <GhostAddBtn open={open} setOpen={setOpen}>
                    <p>Add Idea</p>
                </GhostAddBtn>
            </BtnPopup.Btn>
            <BtnPopup.Form>
                <PopupForm open={open} setOpen={setOpen} formFields={formFields} handleSubmit={handleSubmit} dialogTitle={'Add Idea'} />
            </BtnPopup.Form>
        </BtnPopup>
    )
}