'use client'

import {Dispatch, ReactNode, SetStateAction, SubmitEvent, useState} from "react";
import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {Button, Dialog, DialogPanel, Input} from "@headlessui/react";

interface FormDialogBtnProps{
    children:ReactNode;
    formFields:pushFormNode[];
    handleSubmit:(event:SubmitEvent<HTMLFormElement>)=>void;
    dialogTitle:string;
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
    handleDelete?:()=>void;
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    btnStyle?:string;
}

const FormDialogBtn = ({btnStyle,children,rounded,formFields,handleSubmit,dialogTitle,open,setOpen,handleDelete}:FormDialogBtnProps) => {
    const [inputValue, setInputValue] = useState('');
    return (
        <>
            <Button
                className={btnStyle??'marbleBtn'}
                onClick={()=>setOpen(!open)}
            >
                {children}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4  backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className="text-black py-10 min-w-xs space-y-1 flex flex-col justify-between bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className={'text-lg px-6'}>{dialogTitle}</p>
                            <Button
                                onClick={()=>setOpen(false)}
                                className={'text-black border-none pr-6'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </div>
                        <div className={'max-h-[70vh] overflow-y-scroll flex flex-col gap-6'}>
                            <PushForm fields={formFields} onSubmit={handleSubmit} />
                            { handleDelete &&
                                <>
                                    <hr/>
                                    <div>
                                        <Input
                                            className={`mx-4 pl-2 ${rounded??'rounded-xs'} border deletionCheckInput w-[30ch]`}
                                            placeholder={'Input "Delete" to enable deletion.'}
                                            onChange={(e)=>setInputValue(e.target.value)}
                                        />
                                        <Button
                                            disabled={inputValue.toLowerCase() != 'delete'}
                                            as={'button'}
                                            onClick={handleDelete}
                                            className={`gap-1 disabled:cursor-default bg-gray-100 text-red-900 disabled:text-gray-500 w-fit flex m-4 items-center py-1 ${rounded??'rounded-xs'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>
                                            <p>Delete</p>
                                        </Button>
                                    </div>
                                </>
                            }
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default FormDialogBtn