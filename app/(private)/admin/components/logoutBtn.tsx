'use client'
import {logout} from "@/app/(private)/admin/functions/adminFunctions";
import {useRouter} from "next/navigation";

export default function LogoutBtn(){
    const router = useRouter();
    return(
        <button onClick={()=>logout(router)}
            type="button" className={'bg-white text-black'}>LOGOUT</button>
    )
}