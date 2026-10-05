import {pushCognitoUser} from "@/types";

interface props{
    user:pushCognitoUser,
}

const UserPreviewForAdmin=({user}:props)=>{
    return(
        <div className={'bg-white text-lg text-black w-[80dvw] md:w-150 flex justify-between p-6'}>
            <p>
                {user.user.Attributes?.find(obj=>{return obj.Name=='preferred_username'})?.Value??user.user.Username}
            </p>
            <p>
                {user.group}
            </p>
        </div>
    )
}

export default UserPreviewForAdmin;