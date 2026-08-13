"use client"

import {Button, Field, Fieldset, Input, Label} from "@headlessui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

interface Props {
    style?: 'neon' | 'marble' | string;
    rounded?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl';
    customTitle?: string;
}

const PushLoginForm=({style,rounded,customTitle}:Props)=>{
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [errorMessage, setErrorMessage] = useState<undefined|string>(undefined);
    let titleBg:string;
    switch(style){
        case 'neon':
            titleBg = 'bg-neon-cyan';
            break;
        case 'marble':
            titleBg = 'bg-marble';
            break;
        default:
            titleBg = 'bg-black';
            break;
    }

    const router = useRouter();
    async function attemptLogin(formData: FormData){
        const username = formData.get('username')
        const password = formData.get('password')
        return await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(res.statusText)
            }
        })
    }

    function handleSubmit(formData: FormData){
        toast.promise(
            attemptLogin(formData),
            {
                loading: 'Attempting Login...',
                success: 'Successfully logged in',
                error: (err) => {
                    setErrorMessage(err.toString()=='Error: Incorrect username or password.'?'Incorrect username or password.':'Server Error.');
                    return `Error logging in.`
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
        ).then(()=>{router.refresh()})
    }

    return (
        <div className={`h-75 w-100 aspect-square flex flex-col bg-white ${rounded??'rounded-sm'} overflow-hidden`}>
            <p className={`${titleBg} w-full text-center grow-0 h-15 leading-15 text-2xl font-bold`}>
                {customTitle??'Login'}
            </p>
            <form action={handleSubmit} className={'grow-1 w-full border-black flex flex-col p-6 items-center text-black'}>
                <Fieldset>
                    <Field>
                        <Label className={'block'}>Username</Label>
                        <Input required={true} type={'text'} name={'username'} className={'border border-black w-64 data-focus:outline-1 rounded-xs'} />
                    </Field>
                    <Field className={'my-3'}>
                        <Label className={'block'}>Password</Label>
                        <div className={'border rounded-xs focus-within:outline-1 focus-within:outline-black border-black flex items-center'}>
                            <Input required={true} type={passwordHidden?'password':'text'} name={'password'} className={'data-focus:outline-none w-55'} />
                            <Button
                                className={'w-8 flex justify-center border-none'}
                                onClick={()=>setPasswordHidden(!passwordHidden)}
                            >
                                { passwordHidden ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="slateGray" className="size-6">
                                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="slateGray" className="size-6">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                    </svg>
                                }
                            </Button>
                        </div>
                    </Field>
                </Fieldset>
                <div className={'border-white border h-6 w-full mb-3'}>
                    { errorMessage &&
                        <p className={'text-red-800 text-center'}>! {errorMessage}</p>
                    }
                </div>
                <Button type={'submit'} className={`rounded-xs`}>
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default PushLoginForm;