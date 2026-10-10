"use server"

import {getSession} from "@/session/actions";
import PushLoginForm from "@/app/components/pushLoginForm";

const Page=async(
    {
        params,
    }:
    {params: Promise<{slug: string[]}>
    }
)=>{
    const {slug}= await params;
    const session = await getSession();

    if(!session.isLoggedIn){
        return (
            <div className="w-full h-full min-h-50 grow-1 flex flex-col items-center justify-center">
                <PushLoginForm
                    style={'neon'}
                />
            </div>
        )
    }
    if (!slug){
        return (
            <p>Article Selection Page</p>
        )
    }

    return (
        <p>{slug[0]}</p>
    )
}

export default Page;