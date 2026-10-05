"use client"

import { useState } from "react"

export default function Page(){
    const [input, setInput] = useState<string>('')
    // const re =  new RegExp('[\p{L}\p{M}\p{S}\p{N}\p{P}]+')
    // const re =  new RegExp('[\p{L}]+')
    const re =  new RegExp(/[\p{L}\p{M}\p{S}\p{N}\p{P}]/u)
    const restructureInput =(input:string)=>{
        let endValue = input
        for (const character of input.split('')){
            if (!re.test(character)){
                const letterArray = endValue.split(character)
                endValue = letterArray.join('_')
            }
        }
        return endValue
    }
    return (
        <div>
            <input
                type="text"
                className={'bg-green-200 m-20 text-black'}
                onChange={event => {
                    setInput(event.target.value)
                }}
            />
            <div className={'bg-white text-black w-30 min-h-15 mx-20'}>
                <p>{input}</p>
                <p>{restructureInput(input)}</p>
            </div>
        </div>
    )
}