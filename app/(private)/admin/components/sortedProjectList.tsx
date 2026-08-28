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

const projectFilter=(
    allTags:{value:string,display:string}[],
    selectedTags:string[],
    project:PushProject,
    monthAndYear:[number,number]
):boolean=>{
    if (!filterByTag(allTags,selectedTags,project)){
        return false
    } else {
        const startDate = new Date(monthAndYear[1],monthAndYear[0])
        startDate.setUTCHours(0)
        const endDate = new Date(monthAndYear[1],monthAndYear[0]+1)
        endDate.setUTCHours(0)
        return (new Date(project.date) >= startDate) && (new Date(project.date) < endDate)
    }
}

export default function SortedProjectList  ({projects,tags}:Props){
    const [polarity, setPolarity] = useState<1|-1>(1);
    const [sortBy, setSortBy] = useState<PushSortingFilterOption>(sortingOptions[1])
    const [selectedFilterOptions,setSelectedFilterOptions]=useState<string[]>(tags.map((a)=>a.display))
    const [monthAndYear,setMonthAndYear]=useState<[number,number]>([new Date().getMonth(),new Date().getFullYear()])

    const filteredProjects = projects!.filter(p=>projectFilter(tags,selectedFilterOptions,p,monthAndYear))

    const sortedProjects= filteredProjects.sort((a,b)=>sortBy.sortingFunction(a,b,polarity))

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
                flexibleMonth={false}
                setMonth={setMonthAndYear}
                monthAndYear={monthAndYear}
                minDate={new Date(2026,5,29)}
                maxDate={new Date(2026,10,15)}
                options={{sort: 1,order:1,date:1}}
            />
            { filteredProjects.length > 0 &&
                <LeftWrapJustifyCenterContainer>
                    { sortedProjects.map((project,i) => {
                        return (
                            <ProjectEditBtn project={project} nodes={project.formNodes} key={i} tags={tags} />
                        )
                    })
                    }
                </LeftWrapJustifyCenterContainer>
            }
            {
                filteredProjects.length == 0 &&
                <LeftWrapJustifyCenterContainer>
                    <p>No Projects Found</p>
                </LeftWrapJustifyCenterContainer>
            }
        </div>
    )
}