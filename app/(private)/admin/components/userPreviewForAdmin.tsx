import {pushCognitoUser} from "@/types";

interface props{
    user:pushCognitoUser,
}

const UserPreviewForAdmin=({user}:props)=>{
    return(
        <div className={'bg-white text-lg text-black w-[80dvw] md:w-150 flex justify-between p-6'}>
            <p>
                {user.user.Username}
            </p>
            {/*<p>*/}
            {/*    {user.user.Attributes?.find(obj=>{return obj.Name=='sub'})?.Value??'[No Sub Found]'}*/}
            {/*</p>*/}
            <p className={'capitalize'}>
                {user.group}
            </p>
        </div>
    )
}

export default UserPreviewForAdmin;