"use server"

import {PushCognitoClass} from "@/classes";

export default async function UsersServerWrapper(){
    const users = await PushCognitoClass.listAllUsers().then(response=>{
        return response.Users;
    })
    console.log(users)

    return(
        <div>
            <p>Users Loading...</p>
        </div>
    )
}