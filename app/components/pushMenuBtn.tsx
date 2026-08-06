'use client'

import {ReactNode, useEffect, useState} from "react";

interface props{
    children:ReactNode;
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    btnStyle?:'neon'|'marbleBtn'|string;
}

const generateStyle=(style:string|undefined)=>{
    switch (style){
        case 'neon':
            const angle = (Math.floor(Math.random()*360));
            const delay = (Math.floor(Math.random()*30000));
            return {
                background:`linear-gradient(${angle}deg,hsla(207, 54%, 46%, 0) 10%,hsla(207, 54%, 46%, 1) 10%, hsla(207, 54%, 46%, 1) 25%, hsla(207, 54%, 46%, 1) 75%, hsla(207, 54%, 46%, 1) 90%, hsla(207, 54%, 46%, 0) 90%)`,
                animationDelay:`${delay}ms`,
            };
        case 'marbleBtn':
            return {}
        default:
            return {}
    }
}

const PushMenuBtn=({children,rounded,btnStyle}:props)=>{
    const [style,setStyle]=useState({})
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStyle(generateStyle(btnStyle));
    }, [btnStyle]);
    return (
        <div
            className={`w-fit h-fit grid grid-rows-1 grid-cols-1 overflow-hidden`}
        >
            <div
                className={`col-start-1 col-end-2 row-start-1 row-end-2 ${btnStyle=='neon'?'neonBorder':''}`}
            >
                <div className={`w-full h-full ${rounded??''}`}
                     style={style}>

                </div>
            </div>
            <div
                className={`${btnStyle??''} ${rounded??''}`}
            >
                {children}
            </div>
        </div>
    )
}

export default PushMenuBtn;