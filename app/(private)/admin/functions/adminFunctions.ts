import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import {PushProject} from "@/types";

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

export function compareChanges(newObj:PushProject,oldObj:PushProject){
    const changes:Record<string,string|number|FormDataEntryValue|object|boolean>={}
    for (const value of Object.keys(newObj)){
        if(typeof (newObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value] == 'object'){
            if (
                JSON.stringify((oldObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value]) != JSON.stringify((newObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value])
            ) {
             changes[value] =(newObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value];
            }
        } else {
            if ((oldObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value] != (newObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value]){
                changes[value] =(newObj as unknown as Record<string,string|number|FormDataEntryValue|object|boolean>)[value];
            }
        }
    }
    return changes;
}