import {PushProject} from "@/types";

const ProjectSquare=({project,tags}: {project:PushProject,tags:{display:string,value:string}[]})=>{
    if (project.sick){
        return (
            <div className={'aspect-square w-45 max-w-[30svw] max-h-[30svw] flex flex-col justify-between'}>
                <div className={'w-full grow-1 flex flex-col justify-center items-center'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" fill="currentColor" className="size-20  max-w-1/2 max-h-1/2">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z" clipRule="evenodd" />
                    </svg>
                    <p className={'text-nowrap text-[clamp(0.5rem,4cqw,1rem)]'}>Sick</p>
                </div>
                <p className={'text-left text-sm md:text-md'}>{project.date}</p>
            </div>
        )
    }
    if (project.away){
        return (
            <div className={'aspect-square w-45 max-w-[30svw] max-h-[30svw] flex flex-col justify-between'}>
                <div className={'w-full grow-1 flex flex-col justify-center items-center'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" fill="currentColor" className="size-20 max-w-1/2 max-h-1/2">
                        <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                    </svg>
                    <p className={'text-nowrap text-[clamp(0.5rem,4cqw,1rem)]'}>Away From Home</p>
                </div>
                <p className={'text-left text-sm md:text-md grow-0'}>{project.date}</p>
            </div>
        )
    }
    const tagDisplays = (project.tags??[]).map((tag)=>(tags.find(obj=>obj.value==tag)!.display))
    return(
        <div className={'aspect-square w-45 max-w-[30svw] max-h-[30svw] flex flex-col justify-between'}>
            <p className={'text-left text-md md:text-lg line-clamp-3 font-bold'}>{project.title}</p>
            <div className={'max-w-full'}>
                <p className={'text-left text-sm md:text-md'}>{project.date}</p>
                <p className={'overflow-x-hidden text-sm md:text-md text-left text-nowrap whitespace-nowrap text-ellipsis max-w-full'}>{project.tags.length>0?tagDisplays.join(', '):'[no tags]'}</p>
            </div>
        </div>
    )
}

export default ProjectSquare;