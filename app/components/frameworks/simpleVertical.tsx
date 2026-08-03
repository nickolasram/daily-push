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
                className={'max-w-300 mx-5'}
            >
                {children}
            </div>
        </div>
    )
}

export default SimpleVertical;