"use client"

import {PushProject, PushSortingFilterOption} from "@/types";
import {useState} from "react";
import PushSortFilter from "@/app/components/pushSortFilter";
import LeftWrapJustifyCenterContainer from "@/app/components/frameworks/leftWrapJustifyCenterContainer";
import {ProjectEditBtn} from "@/app/(private)/admin/components/editBtns";
import Link from "next/link";
import PushMenuBtn from "@/app/components/pushMenuBtn";
import ProjectSquare from "@/app/components/projectSquare";

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

const projectFilter=(
    project:PushProject,
    monthAndYear:[number,number]
):boolean=>{
    const startDate = new Date(monthAndYear[1],monthAndYear[0])
    startDate.setUTCHours(0)
    const endDate = new Date(monthAndYear[1],monthAndYear[0]+1)
    endDate.setUTCHours(0)
    return (new Date(project.date) >= startDate) && (new Date(project.date) < endDate)
}

interface Props{
    projects:PushProject[];
    tags:{value:string,display:string}[];
}

export default function HomeProjectList({projects,tags}:Props) {
    const [polarity, setPolarity] = useState<1|-1>(1);
    const [sortBy, setSortBy] = useState<PushSortingFilterOption>(sortingOptions[1])
    const [monthAndYear,setMonthAndYear]=useState<[number,number]>([new Date().getMonth(),new Date().getFullYear()])

    const filteredProjects = projects!.filter(p=>projectFilter(p,monthAndYear))

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
                flexibleMonth={false}
                setMonth={setMonthAndYear}
                monthAndYear={monthAndYear}
                minDate={new Date(2026,5,29)}
                maxDate={new Date(2026,10,15)}
                options={{sort: 1,order:1,date:1}}
            />
            { filteredProjects.length > 0 &&
                <LeftWrapJustifyCenterContainer>
                    { sortedProjects!.map(
                        (project,i) => {
                            return (
                                <Link
                                    href={'/project/'+project.date}
                                    key={i}
                                    target={'_blank'}
                                >
                                    <PushMenuBtn
                                        btnStyle={'neon'}
                                        rounded={'rounded-md'}
                                    >
                                        <ProjectSquare project={project} tags={tags} />
                                    </PushMenuBtn>
                                </Link>
                            )
                        }
                    )
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