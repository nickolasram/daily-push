"use server"

import { Suspense } from "react";
import ProjectsList from "@/app/(private)/admin/components/projectsList";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";
import TagForm from "@/app/(private)/admin/components/tagForm";
import TagsList from "@/app/(private)/admin/components/tagsList";
import FormTagLoader from "@/app/(private)/admin/components/formTagLoader";
import ThinTabsFramework, {TTFChild} from "@/app/components/frameworks/thinTabsFramework";


const Page=()=>{
    return (
        <ThinTabsFramework tabs={['Projects','Tags']} tabListAddendum={<LogoutBtn/>}>
            <TTFChild>
                <Suspense fallback={<p>Loading...</p>}>
                    <ProjectsList />
                </Suspense>
                <Suspense fallback={<p>Loading...</p>}>
                    <FormTagLoader />
                </Suspense>
            </TTFChild>
            <TTFChild>
                <Suspense fallback={<p>Loading...</p>}>
                    <TagsList />
                </Suspense>
                <TagForm />
            </TTFChild>
        </ThinTabsFramework>
    )
}

export default Page;