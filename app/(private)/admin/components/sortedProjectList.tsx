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

const filterByTag=(
    allTags:{value:string,display:string}[],
    selectedTags:string[],
    project:PushProject,
):boolean=>{
    if (allTags.length==selectedTags.length){
        return true
    }
    if (project.tags.length==0||!project.tags){
        return false
    }
    for (const tag of project.tags){
        const tagObject = allTags.find(a=>a.value===tag)
        const tagObjectValue = tagObject?.display
        if (!selectedTags.includes(tagObjectValue!)){
            return false
        }
    }
    return true
}

export default function SortedProjectList  ({projects,tags}:Props){
    const [polarity, setPolarity] = useState<1|-1>(1);
    const [sortBy, setSortBy] = useState<PushSortingFilterOption>(sortingOptions[1])
    const [selectedFilterOptions,setSelectedFilterOptions]=useState<string[]>(tags.map((a)=>a.display))
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return(
        <div className={'w-full'}>
            <PushSortFilter
                sortingOptions={sortingOptions}
                style={'neon'}
                setSortBy={setSortBy}
                sortBy={sortBy}
                polarity={polarity}
                setPolarity={setPolarity}
                filterOptions={tags.map((a)=>a.display)}
                selectedFilterOptions={selectedFilterOptions}
                setSelectedFilterOptions={setSelectedFilterOptions}
                startDate={startDate}
                endDate={endDate}
                flexibleMonth={true}
            />
            <LeftWrapJustifyCenterContainer>
                { projects!.filter(p=>filterByTag(tags,selectedFilterOptions,p)).sort((a,b)=>sortBy.sortingFunction(a,b,polarity)).map((project,i) => {
                    return (
                        <ProjectEditBtn project={project} nodes={project.formNodes} key={i} tags={tags} />
                    )
                })
                }
            </LeftWrapJustifyCenterContainer>
        </div>
    )
}