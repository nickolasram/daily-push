import {Button, Dialog, DialogPanel} from "@headlessui/react";
import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {Dispatch, SetStateAction, SubmitEvent} from "react";

interface PopupFormProps {
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
    formFields:pushFormNode[];
    handleSubmit:(event:SubmitEvent<HTMLFormElement>)=>void;
    dialogTitle:string;
}

const PopupForm = ({open,setOpen,formFields,dialogTitle,handleSubmit}: PopupFormProps) => {
    return (
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
                    <div className={'max-h-[70vh] overflow-y-scroll'}>
                        <PushForm fields={formFields} onSubmit={handleSubmit} />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default PopupForm;