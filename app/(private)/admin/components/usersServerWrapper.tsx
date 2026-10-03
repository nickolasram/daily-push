"use server"

import {PushCognitoClass} from "@/classes";
import UsersClientWrapper from "@/app/(private)/admin/components/usersClientWrapper";
import AddUserBtn from "@/app/(private)/admin/components/addUserBtn";

export default async function UsersServerWrapper(){
    const users = await PushCognitoClass.listAllUsersWithGroups()
    return(
        <div>
            <div className={'text-lg w-[80dvw] md:w-150 flex justify-between px-6 pb-3'}>
                <p>Username</p>
                <p>Role</p>
            </div>
            <UsersClientWrapper users={users} />
            <AddUserBtn />
        </div>
    )
}