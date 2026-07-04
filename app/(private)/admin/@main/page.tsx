"use client"

import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

const Page=()=>{
    const router = useRouter();
    async function attemptLogout(){
        return await fetch('/api/logout', {
            method: 'POST',
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(`${res.statusText}`)
            }
        })
    }

    function logout(){
        toast.promise(
            attemptLogout(),
            {
                loading: 'Attempting Logout...',
                success: 'Successfully logged out',
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
        <div>
            Welcome to Push App
            <button onClick={logout}
            type="button" className={'bg-white text-black'}>LOGOUT</button>
        </div>
    )
}

export default Page;