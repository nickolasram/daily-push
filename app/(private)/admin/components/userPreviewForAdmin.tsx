import {pushCognitoUser} from "@/types";

interface props{
    user:pushCognitoUser,
}

const UserPreviewForAdmin=({user}:props)=>{
    return(
        <div>
            <p>
                {user.user.Username}
            </p>
            <p>
                {user.user.Attributes?.find(obj=>{return obj.Name=='sub'})?.Value??'[No Sub Found]'}
            </p>
        </div>
    )
}

export default UserPreviewForAdmin;