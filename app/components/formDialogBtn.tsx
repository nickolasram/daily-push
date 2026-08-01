'use client'

import {Dispatch, ReactNode, SetStateAction, SubmitEvent, useState} from "react";
import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {Button, Input} from "@headlessui/react";
import PushDialog from "./pushDialog";

interface FormDialogBtnProps{
    children:ReactNode;
    formFields:pushFormNode[];
    handleSubmit:(event:SubmitEvent<HTMLFormElement>)=>void;
    dialogTitle:string;
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
    handleDelete?:()=>void;
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    btnStyle?:'neon'|'marbleBtn'|string;
}

const FormDialogBtn = ({btnStyle,children,rounded,formFields,handleSubmit,dialogTitle,open,setOpen,handleDelete}:FormDialogBtnProps) => {
    const [inputValue, setInputValue] = useState('');
    const [angle] = useState(()=>(Math.floor(Math.random()*360)));
    const [delay] = useState(()=>(Math.floor(Math.random()*10000)));
    const genBorderStyle=btnStyle=='neonBtn'?
        {
            display:'none'
        }
        :
        {
            background:`linear-gradient(${angle}deg,rgba(0, 117, 149, 0.25) 27%, rgba(94, 171, 171, 1) 50%, rgba(0, 117, 149, 0.25) 64%)`,
            animationDelay:`${delay}ms`,
        };
    return (
        <>
            <div
                className={`w-fit h-fit grid grid-rows-1 grid-cols-1 overflow-hidden`}
            >
                <div
                    className={`col-start-1 col-end-2 row-start-1 row-end-2 ${btnStyle=='neon'?'neonBorder':''}`}
                >
                    <div className={'w-full h-full'}
                         style={genBorderStyle}>

                    </div>
                </div>
                <Button
                    className={btnStyle??''}
                    onClick={()=>setOpen(!open)}
                >
                    {children}
                </Button>
            </div>
            <PushDialog open={open} setOpen={setOpen} title={dialogTitle}>
                <div className={'max-h-[70vh] overflow-y-scroll flex flex-col gap-6'}>
                    <PushForm fields={formFields} onSubmit={handleSubmit} />
                    { handleDelete &&
                        <>
                            <hr/>
                            <div>
                                <Input
                                    className={`mx-4 pl-2 ${rounded??'rounded-xs'} border deletionCheckInput w-[30ch]`}
                                    placeholder={'Type "Delete" to enable deletion.'}
                                    onChange={(e)=>setInputValue(e.target.value)}
                                />
                                <Button
                                    disabled={inputValue.toLowerCase() != 'delete'}
                                    as={'button'}
                                    onClick={handleDelete}
                                    className={`deletionCheckBtn`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                    <p>Delete</p>
                                </Button>
                            </div>
                        </>
                    }
                </div>
            </PushDialog>
        </>
    )
}

export default FormDialogBtn