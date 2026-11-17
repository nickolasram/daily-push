"use server"

import ProjectForm from "@/app/(private)/admin/components/projectForm";
import {PushDynamoTag} from "@/models";

export default async function FormTagLoader(){
    const tags = await PushDynamoTag.getCategoryTags('daily-push','project')
    return (
        <div className={'w-full flex justify-center max-w-[90svw] mb-6'}>
            <div className={'w-9/10'}>
                <ProjectForm tags={tags??[]} />
            </div>
        </div>
    )
}