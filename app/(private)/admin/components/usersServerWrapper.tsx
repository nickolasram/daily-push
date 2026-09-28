"use server"

import {PushCognitoClass} from "@/classes";
import UserPreviewForAdmin from "@/app/(private)/admin/components/userPreviewForAdmin";

export default async function UsersServerWrapper(){
    const users = await PushCognitoClass.listAllUsersWithGroups()
    return(
        <div>
            <div className={'text-lg w-[80dvw] md:w-150 flex justify-between px-6 pb-3'}>
                <p>Username</p>
                <p>Role</p>
            </div>
            { users.map((user,i)=>{
                return <UserPreviewForAdmin user={user} key={i} />
            })
            }
        </div>
    )
}