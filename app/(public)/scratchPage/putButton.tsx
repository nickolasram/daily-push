"use client"

import toast from "react-hot-toast";

export default function PutButton(){
    async function attemptPut(){
        return await fetch('/api/projects', {
            method: 'POST',
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(`${res.statusText}`)
            }
        })
    }

    function handleSubmit(){
        toast.promise(
            attemptPut(),
            {
                loading: 'Attempting Login...',
                success: 'Successfully logged in',
                error: (err) => `${err}`,
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                }
            }
        )
    }

    return (
        <button type={'button'} onClick={handleSubmit}>BUTTON</button>
    )
}