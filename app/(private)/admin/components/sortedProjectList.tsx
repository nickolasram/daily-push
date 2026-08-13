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
                        <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>
                            {sortBy}
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
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
                <p>FILTER BY TAG</p>
                <p>FILTER BY DATE</p>
                <p>SEARCH</p>
                <p>DISPLAYED PER PAGE</p>
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