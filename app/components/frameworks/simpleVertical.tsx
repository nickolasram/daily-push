import {ReactNode} from "react";

interface props{
    children:ReactNode
}

const SimpleVertical=({children}:props)=>{
    return(
        <div
            className={'w-full flex items-center justify-center my-6'}
        >
            <div
                className={'max-w-200 w-full mx-5 flex flex-col items-center justify-center gap-6'}
            >
                {children}
            </div>
        </div>
    )
}

export default SimpleVertical;