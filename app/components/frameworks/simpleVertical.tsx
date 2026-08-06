import {ReactNode} from "react";

interface props{
    children:ReactNode
}

const SimpleVertical=({children}:props)=>{
    return(
        <div
            className={'w-full flex items-center justify-center'}
        >
            <div
                className={'max-w-300 mx-5 flex flex-col items-center justify-center gap-6'}
            >
                {children}
            </div>
        </div>
    )
}

export default SimpleVertical;