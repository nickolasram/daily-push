'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {RefObject, SubmitEvent, useState} from "react";
import {Button, Switch} from "@headlessui/react";

export const ArticleControls = () => {
    return (
        <div className={'flex gap-2 flex-nowrap'}>
            <button type="submit" data-value={'save'} className={'w-fit'}>Save Draft</button>
            <button type="submit" data-value={"publish"} className={'w-fit px-[2ch]'}>Publish</button>
        </div>
    )
}

interface ArticleFormProps {
    fields: pushFormNode[],
    inputRoundedDefault?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    labelPlacementDefault?: 'column' | 'row',
    onSubmit: (event: SubmitEvent<HTMLFormElement>)=>void,
    rounded?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    ref?: RefObject<HTMLFormElement|null>,
    settingFields: pushFormNode[],
    onSettingsSubmit: (event: SubmitEvent<HTMLFormElement>)=>void,
}

export const ArticleBodySwitch=()=>{
    return (
        <div className={'flex gap-2 flex-nowrap items-center'}>
            <p>Body Content</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            <div>
                <p>Saved Draft</p>
                <p>Published Content</p>
            </div>
        </div>
    )
}

export const ArticleVisibilityToggle=()=>{
    return (
        <div className={'mt-1 group'}>
            <p>Article Publicness</p>
            <div className={'flex items-center gap-2'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 opacity-100 group-has-checked:opacity-50">
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                </svg>
                <div className={'grid grid-cols-2 grid-rows-1 w-8'}>
                    <div className={'h-4 w-8 rounded-full border col-start-1 bg-black/50 group-has-checked:bg-black col-end-2 row-start-1 row-end-1'}>
                    </div>
                    <div className={'h-4 w-4 group-has-checked:translate-x-4 bg-white rounded-full border col-start-1 col-end-1 row-start-1 row-end-1'}></div>
                    <input type={'checkbox'} name={'articlePublicness'} className={'col-start-1 opacity-0 col-end-2 row-start-1 row-end-1 cursor-pointer h-4 w-8'}/>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 opacity-50 group-has-checked:opacity-100">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    )
}

const ArticleForm = (
    {
        fields,
        onSubmit,
        labelPlacementDefault,
        rounded,
        inputRoundedDefault,
        ref,
        onSettingsSubmit,
        settingFields
    }:ArticleFormProps
) => {
    const [settings,setSettings] = useState(false)
    const [info,setInfo] = useState(false)
    return (
        <div className={'w-fit bg-white'}>
            <div className={'w-full h-14 gap-6 px-6 pb-1 flex justify-start items-end'}>
                <Button
                    className={'rounded-full border-3 border-[#808080] aspect-square flex items-center justify-center overflow-hidden size-11 bg-white'}
                    onClick={() => {
                        setSettings(false);
                        setInfo(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="gray" className="size-8 min-w-8 bg-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </Button>
                <Button
                    className={'rounded-full border-3 border-[#808080] aspect-square flex items-center justify-center overflow-hidden size-11 bg-white'}
                    onClick={() => {
                        setSettings(true)
                        setInfo(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0.25 0.5 24 24" strokeWidth={2} stroke="gray" className="size-9 min-w-9 bg-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Button>
                <Button
                    className={'rounded-full border-3 border-[#808080] aspect-square flex items-center justify-center overflow-hidden size-11 bg-white'}
                    onClick={() => {
                        setSettings(false)
                        setInfo(true)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="5 5 14 15" strokeWidth={2} stroke="grey" className="size-9 min-w-9 bg-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M12 8h.008v.008H12V8.25Z" />
                    </svg>
                </Button>
            </div>
            <div className={'w-fit grid grid-rows-1 grid-cols-1'}>
                <div className="w-fit h-fit row-span-full col-span-full">
                    <PushForm
                        fields={fields}
                        onSubmit={onSubmit}
                        altControls={ArticleControls()}
                        labelPlacementDefault={labelPlacementDefault}
                        ref={ref}
                        rounded={rounded}
                        inputRoundedDefault={inputRoundedDefault}
                    />
                </div>
                <div className={`w-full h-full row-span-full col-span-full bg-white ${settings?'z-50':'-z-1'}`}>
                    <PushForm
                        fields={settingFields}
                        onSubmit={onSettingsSubmit}
                        labelPlacementDefault={labelPlacementDefault}
                        rounded={rounded}
                        inputRoundedDefault={inputRoundedDefault}
                    />
                    <div className={'w-full border-0 border-t-1 border-black text-black p-6'}>
                        <p>Input xxxx to enable deletion</p>
                        <input type={'text'} className={'border-1 mb-2 border-black'} />
                        <Button
                            className={'block'}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
                <div className={`w-full h-full row-span-full col-span-full bg-white ${info?'z-50':'-z-1'}`}>
                    <p className={'text-black'}>ARTICLE INFO</p>
                </div>
            </div>
        </div>
    )
}

export default ArticleForm;