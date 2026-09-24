"use server"

import { Suspense } from "react";
import ProjectsList from "@/app/(private)/admin/components/projectsList";
import TagForm from "@/app/(private)/admin/components/tagForm";
import TagsList from "@/app/(private)/admin/components/tagsList";
import FormTagLoader from "@/app/(private)/admin/components/formTagLoader";
import ThinTabsFramework, {TTFChild} from "@/app/components/frameworks/thinTabsFramework";
import IdeasWrapper from "@/app/(private)/admin/components/ideasWrapper";
import UsersServerWrapper from "@/app/(private)/admin/components/usersServerWrapper";


const Page=()=>{
    return (
        <ThinTabsFramework tabs={['Projects','Tags', 'Demos', 'Ideas','Users']}>
            <TTFChild>
                <h2 className={'mb-4 md:mb-6'}>Projects</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <ProjectsList />
                </Suspense>
                <Suspense fallback={<p>Loading...</p>}>
                    <FormTagLoader />
                </Suspense>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-4 md:mb-6'}>Project Tags</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <>
                        <TagsList />
                        <TagForm />
                    </>
                </Suspense>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-4 md:mb-6'}>Demos</h2>
                <p>coming soon</p>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-4 md:mb-6'}>Ideas</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <IdeasWrapper />
                </Suspense>
            </TTFChild>
            <TTFChild>
                <h2 className={'mb-4 md:mb-6'}>Users</h2>
                <Suspense fallback={<p>Loading...</p>}>
                    <UsersServerWrapper />
                </Suspense>
            </TTFChild>
        </ThinTabsFramework>
    )
}

export default Page;