import {ReactNode} from "react";

interface props{
    children:ReactNode;
}

const LeftWrapJustifyCenterContainer=({children}:props)=>{
    return (
        <div className={'w-full flex justify-center max-w-[90svw]'}>
            <div className={'leftWrapJustifyCenterContainer'}>
                {children}
            </div>
        </div>
    )
}

export default LeftWrapJustifyCenterContainer;