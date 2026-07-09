"use client"

import {useState} from "react";
import { Button, Dialog, DialogPanel } from '@headlessui/react'
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";

const AdminBurger=()=>{
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={()=>setOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4  backdrop-blur-xl backdrop-brightness-50">
                    <DialogPanel className="max-w-lg py-30 min-w-xs space-y-4 h-full flex flex-col justify-between">
                        <div className="flex justify-end w-full">
                            <Button onClick={()=>setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </div>
                        <LogoutBtn />
                        <p className={'opacity-0'}>popup</p>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default AdminBurger;