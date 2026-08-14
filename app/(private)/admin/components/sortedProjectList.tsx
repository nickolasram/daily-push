"use client"

import {PushProject} from "@/types";
import {ProjectEditBtn} from "@/app/(private)/admin/components/editBtns";
import LeftWrapJustifyCenterContainer from "@/app/components/frameworks/leftWrapJustifyCenterContainer";
import {useState} from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

interface Props{
    projects:PushProject[];
    tags:{value:string,display:string}[];
}

const SortedProjectList = ({projects,tags}:Props)=>{
    const [sortBy, setSortBy] = useState<'date'|'name'>('date');

    return(
        <div className={'w-full'}>
            <div className={'w-full flex gap-6 mb-6'}>
                <Listbox value={sortBy} onChange={setSortBy}>
                    <ListboxButton
                     className={'border border-white rounded-sm flex gap-2'}
                    >
                        <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>sort</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path strokeWidth={1.5} d="M3 6.75h16.5M5 12h12.5M7 17.25h8.5" stroke={'currentColor'} strokeLinecap={'round'} />
                        </svg>
                    </ListboxButton>
                    <ListboxOptions anchor="bottom" className={'w-24 bg-neon-cyan px-1'}>
                        {['date', 'name'].map((option,i) => (
                            <ListboxOption key={i} value={option} className="truncate cursor-pointer data-focus:brightness-75">
                                {option}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
                <div
                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                >
                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>order</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                    </svg>
                    {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">*/}
                    {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />*/}
                    {/*</svg>*/}
                </div>
                <div
                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                >
                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>tags</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                </div>
                <div
                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                >
                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>date</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </div>
                <div
                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                >
                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>search</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <div
                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                >
                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>items</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                </div>
            </div>
            <LeftWrapJustifyCenterContainer>
                { projects!.map((project,i) => {
                    return (
                        <ProjectEditBtn project={project} nodes={project.formNodes} key={i} tags={tags} />
                    )
                })
                }
            </LeftWrapJustifyCenterContainer>
        </div>
    )
}

export default SortedProjectList;