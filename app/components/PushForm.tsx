'use client'
import {Fragment, ReactNode, SubmitEventHandler, useReducer} from "react";
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import TextEditor from "@/app/components/textEditor/TextEditor";

export interface pushFormNode {
    name:string,
    id:string,
    label?:string,
    type:'text' | 'number' | 'textArea' | 'richTextField' | 'file' | 'image' | 'date' | 'custom',
    node?:ReactNode,
    labelPlacement?:'column'|'row',
    inputRounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    max?:number,
    min?:number,
//     placeholder
//     default
//     onChange
}

interface pushFormProps {
    fields: pushFormNode[],
    onSubmit: SubmitEventHandler<HTMLFormElement>,
    labelPlacementDefault?:'column'|'row',
    inputRoundedDefault?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
}

const PushForm = ({fields, onSubmit, labelPlacementDefault, rounded,inputRoundedDefault}:pushFormProps)=>{
    const [state, dispatch] = useReducer(
        // TODO: fix typing without ignoring
        (
            state: Record<string, unknown>,
            newState: Record<string, unknown>
        ) => ({...state, ...newState}),
        {
            editorKey:0,
            defaultDescription:''
        }
    );
    const setDescription=(description:string)=>{
        dispatch({description: description})
    }
    let longestLabel:number = 0;
    for (const field of fields) {
        if (field.type != 'custom') {
            const label = field.label??field.name;
            const length = label.length;
            if (length > longestLabel) {
                longestLabel = length;
            }
        }
    }

    return (
        <form onSubmit={(event)=>{
            onSubmit(event);
        }}
            className={`p-6 w-fit bg-white text-black flex flex-col gap-3 justify-center ${rounded??'rounded-sm'}`}
        >
            { fields.map((field,i) =>{
                const inputClassNameDefault=`border ${field.inputRounded??inputRoundedDefault??'rounded-xs'}`
                if(field.type === 'text'){
                        return (
                            <Field key={i} className="flex"
                                   style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                                <Label
                                    style={{minWidth: longestLabel + 1 + 'ch',}}
                                >
                                    {field.label??field.name}
                                </Label>
                                <Input className={inputClassNameDefault} type="text"/>
                            </Field>
                        )
                    }
                else if(field.type === 'number'){
                    return (
                        <Field key={i} className="flex"
                               style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <Label
                                style={{minWidth: longestLabel + 1 + 'ch',}}
                            >
                                {field.label??field.name}
                            </Label>
                            <Input
                                className={inputClassNameDefault}
                                type="number"
                                min={field.min??Number.MIN_VALUE}
                                max={field.max??Number.MAX_VALUE}
                                style={{
                                    //TODO: Make width customizable
                                    maxWidth:'200px',
                                }}
                            />
                        </Field>
                    )
                }
                else if(field.type === 'richTextField'){
                    return (
                        <div className="md:w-150 max-w-[calc(100vh - 60px)]" key={i}>
                            <TextEditor
                                key={state.editorKey as number}
                                editorContent={state.defaultDescription as string}
                                onChange={setDescription}
                                editorBG={'bg-white'}
                                defaultColor={'text-black'}
                            />
                        </div>
                    )
                }
                else if(field.type == 'custom' && field.node){
                        return <Fragment key={i}>{field.node}</Fragment>
                }
                else {
                            return(
                                <div key={i}>
                                    <p>name: {field.name}</p>
                                    <p>type: {field.type}</p>
                                    <p>id: {field.id}</p>
                                </div>
                            )
                        }
                    }
                )
            }
            <button type={'submit'} className={'w-fit'}>Submit</button>
        </form>
    )
}

export default PushForm;