"use client"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm =()=>{
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
                return res.json()
            } else {
                throw new Error(`${res.statusText}`)
            }
        })
    }

    function handleSubmit(formData: FormData){
        toast.promise(
            attemptLogin(formData),
            {
                loading: 'Attempting Login...',
                success: 'Successfully logged in',
                error: (err) => `${err}`,
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                }
            }
        ).then(()=>{router.refresh()})
    }

    return (
        <form action={handleSubmit} className="size-40 border-white border-2">
            <p className="text-center">name</p>
            <input className={'bg-white text-black'} type={"text"} name={'username'} id={'username'} />
            <p className="text-center">password</p>
            <input className={'text-black bg-white'} type={"password"} name={'password'} id={'password'} />
            <button
                type={'submit'}
                className="bg-white text-black cursor-pointer btn btn-primary btn-lg btn-block">Login</button>
        </form>
    )
}

export default LoginForm;