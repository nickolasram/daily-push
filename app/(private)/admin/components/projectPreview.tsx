import {PushProject} from "@/types";
import {Button} from "@headlessui/react";

interface ProjectPreviewProps {
    project:PushProject;
}

const ProjectPreview=({project}:ProjectPreviewProps)=>{
    const lastIndex = project.tags.length-1
    return(
        <Button className={'aspect-square p-4 bg-gray-100 border-gray-600 text-gray-600 size-45 flex flex-col justify-between items-start'}>
            <div>
                <p className={'text-left text-lg font-bold'}>{project.title}</p>
                <p className={'text-left'}>{project.date}</p>
            </div>
            <div className={'flex flex-nowrap w-100 overflow-x-hidden gap-2'}>
                { project.tags.map((tag,i)=>{
                  return (
                      <p key={i}>{tag}{i!=lastIndex?',':''}</p>
                  )
                })
                }
            </div>
        </Button>
    )
}

export default ProjectPreview;