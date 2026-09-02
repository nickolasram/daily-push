"use client"
import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {SubmitEvent} from "react";
import {PushDynamoArticle} from "@/classes";

export default function Page(){
    const scratchArticle = new PushDynamoArticle();

    const formNodes:pushFormNode[] = scratchArticle.formNodes

    const altControls = scratchArticle.altControls()

    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        alert(scratchArticle.getControlValue(event))
    }

    return (
        <div>
            <PushForm fields={formNodes} onSubmit={handleSubmit} altControls={altControls()} />
        </div>
    )
}