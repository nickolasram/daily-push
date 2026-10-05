"use client"

import UserPreviewForAdmin from "@/app/(private)/admin/components/userPreviewForAdmin";
import {UserType} from "@aws-sdk/client-cognito-identity-provider";
import Link from "next/link";
import AddUserBtn from "@/app/(private)/admin/components/addUserBtn";
import {useState} from "react";

interface props{
    loadedUsers:{user:UserType,group:string}[]
}

const UsersClientWrapper=({loadedUsers}:props)=>{
    const [users,setUsers]=useState(loadedUsers);
    const reloadUsers = async ()=>{
        const response = await fetch("/api/users", {
            method:"GET",
        })
        const data = await response.json()
        const parsedData = JSON.parse(data)
        const usersArray = parsedData.data as {user:UserType,group:string}[]
        setUsers(usersArray)
    }
    return (
        <div>
            <div>
                { users.map((user,i)=>{
                        return (
                            <Link
                                href={'/user-view/'+(user.user.Attributes?.find(obj=>{return obj.Name=='sub'})?.Value??'404')}
                                target="_blank"
                                key={i}>
                                <UserPreviewForAdmin user={user} />
                            </Link>
                        )
                    })
                }
            </div>
            <AddUserBtn
                onSuccess={reloadUsers}
            />
        </div>
    )
}

export default UsersClientWrapper;