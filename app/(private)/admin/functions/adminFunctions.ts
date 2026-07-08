import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

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

export function logout(router:AppRouterInstance){
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

