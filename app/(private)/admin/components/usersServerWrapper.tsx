"use server"

import {PushCognitoClass} from "@/classes";
import UserPreviewForAdmin from "@/app/(private)/admin/components/userPreviewForAdmin";

export default async function UsersServerWrapper(){
    const users = await PushCognitoClass.listAllUsersWithGroups()
    return(
        <div>
            { users.map((user,i)=>{
                return <UserPreviewForAdmin user={user} key={i} />
            })
            }
        </div>
    )
}