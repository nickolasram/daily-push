"use client"

import {PushProject, PushSortingFilterOption} from "@/types";
import {ProjectEditBtn} from "@/app/(private)/admin/components/editBtns";
import LeftWrapJustifyCenterContainer from "@/app/components/frameworks/leftWrapJustifyCenterContainer";
import PushSortFilter from "@/app/components/pushSortFilter";
import {useState} from "react";

interface Props{
    projects:PushProject[];
    tags:{value:string,display:string}[];
}

const sortProjectByName=(obj1:PushProject,obj2:PushProject,polarity:number=1)=>{
    return polarity * obj1.title.localeCompare(obj2.title, undefined, {numeric:true});
}

const sortProjectByDate=(obj1:PushProject,obj2:PushProject,polarity:number=1)=>{
    return polarity *  (new Date(obj1.date).getTime() - new Date(obj2.date).getTime());
}

const sortingOptions = [
    {
        label:'name',
        sortingFunction: sortProjectByName as (obj1:object,obj2:object,polarity?:number)=>number
    },
    {
        label:'date',
        sortingFunction: sortProjectByDate as (obj1:object,obj2:object,polarity?:number)=>number
    }

]

const SortedProjectList = ({projects,tags}:Props)=>{
    const [polarity, setPolarity] = useState<1|-1>(1);
    const [sortBy, setSortBy] = useState<PushSortingFilterOption>(sortingOptions[1]);

    return(
        <div className={'w-full'}>
            <PushSortFilter
                sortingOptions={sortingOptions}
                style={'neon'}
                setSortBy={setSortBy}
                sortBy={sortBy}
                polarity={polarity}
                setPolarity={setPolarity}
            />
            <LeftWrapJustifyCenterContainer>
                { projects!.sort((a,b)=>sortBy.sortingFunction(a,b,polarity)).map((project,i) => {
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