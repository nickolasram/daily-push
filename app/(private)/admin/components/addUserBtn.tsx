"use client"

import FormDialogBtn from "@/app/components/formDialogBtn";
import {SubmitEvent, useState} from "react";
import {pushFormNode} from "@/app/components/PushForm";
import toast from "react-hot-toast";

interface props{
    onSuccess:() => void;
}

const AddUserBtn =({onSuccess}:props)=>{
    const [open, setOpen] = useState(false);

    const fetchApi=async (e:SubmitEvent<HTMLFormElement>)=>{
        return fetch('/api/users', {
            method: 'POST',
            body: new FormData(e.currentTarget)
        }).then(async res => {
            if (res.ok) {
                setOpen(false);
                onSuccess();
                return res
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }

    const handleSubmit = async(e:SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.promise(
            fetchApi(e),
            {
                loading: 'Attempting to Create User...',
                success: 'Successfully Created User',
                error: () => {
                    return `Error Creating User.`
                },
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                },
                error: {
                    duration: 500,
                }
            }
        )
    }


    const generatePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
        let newPassword = '';
        for (let i = 0; i < 16; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return newPassword;
    };
    const [generatedPassword] = useState(()=> generatePassword())

    const formFields:pushFormNode[] = [
        {
            type:'text',
            name:'username',
            label:'Username',
        },
        {
            type:'password',
            name:'password',
            label:'Password',
            defaultShow:true,
            defaultValue:generatedPassword,
        },
        {
            type: 'email',
            name:'email',
            label:'Email',
        },
        {
            type: 'radio',
            name:'role',
            label:'Permissions/Role',
            defaultCheckedIndex:1,
            options: [
                {
                    value:'Admin',
                    label:'Admin',
                },
                {
                    value:'User',
                    label:'User',
                }
            ]
        }
    ]
    return (
        <FormDialogBtn
            dialogTitle="Add User"
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            formFields={formFields}
        >
            <div
                className="flex gap-3 ghostAddBtn my-6 px-3 mx-0 bg-neon-cyan/75 w-max"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>
                <p>Create New User</p>
            </div>
        </FormDialogBtn>
    )
}

export default AddUserBtn;