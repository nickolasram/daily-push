"use client"

import UserPreviewForAdmin from "@/app/(private)/admin/components/userPreviewForAdmin";
import {UserType} from "@aws-sdk/client-cognito-identity-provider";
import Link from "next/link";

interface props{
    users:{user:UserType,group:string}[]
}

const UsersClientWrapper=({users}:props)=>{
    return (
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
    )
}

export default UsersClientWrapper;