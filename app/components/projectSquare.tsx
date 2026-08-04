import {PushProject} from "@/types";

const ProjectSquare=({project,tags}: {project:PushProject,tags:{display:string,value:string}[]})=>{
    const tagDisplays = (project.tags??[]).map((tag)=>(tags.find(obj=>obj.value==tag)!.display))
    return(
        <div className={'aspect-square size-45 flex flex-col justify-between'}>
            <p className={'text-left text-lg line-clamp-3 font-bold'}>{project.title}</p>
            <div className={'max-w-full'}>
                <p className={'text-left'}>{project.date}</p>
                <p className={'overflow-x-hidden text-left text-nowrap whitespace-nowrap text-ellipsis max-w-full'}>{project.tags.length>0?tagDisplays.join(', '):'[no tags]'}</p>
            </div>
        </div>
    )
}

export default ProjectSquare;