"use server"

import { Suspense } from "react";
import ProjectsList from "@/app/(private)/admin/components/projectsList";
import TagForm from "@/app/(private)/admin/components/tagForm";
import TagsList from "@/app/(private)/admin/components/tagsList";
import FormTagLoader from "@/app/(private)/admin/components/formTagLoader";
import ThinTabsFramework, {TTFChild} from "@/app/components/frameworks/thinTabsFramework";
import IdeasWrapper from "@/app/(private)/admin/components/ideasWrapper";


const Page=()=>{
    return (
        <ThinTabsFramework tabs={['Projects','Tags', 'Demos', 'Ideas']}>
            <TTFChild>
                <h2 className={'mb-6'}>Projects</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <ProjectsList />
                </Suspense>
                <Suspense fallback={<p>Loading...</p>}>
                    <FormTagLoader />
                </Suspense>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-6'}>Project Tags</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <>
                        <TagsList />
                        <TagForm />
                    </>
                </Suspense>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-6'}>Demos</h2>
                <p>coming soon</p>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-6'}>Ideas</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <IdeasWrapper />
                </Suspense>
            </TTFChild>
        </ThinTabsFramework>
    )
}

export default Page;