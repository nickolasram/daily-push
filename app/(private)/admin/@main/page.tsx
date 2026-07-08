"use server"

import { Suspense } from "react";
import ProjectsList from "@/app/(private)/admin/components/projectsList";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";
import ProjectForm from "@/app/(private)/admin/components/projectForm";
import TagForm from "@/app/(private)/admin/components/tagForm";
import TagsList from "@/app/(private)/admin/components/tagsList";
import FormTagLoader from "@/app/(private)/admin/components/formTagLoader";


const Page=()=>{
    return (
        <div>
            Welcome to Push App
            <LogoutBtn/>

            <div>
                <p>Projects</p>
                <Suspense fallback={<p>Loading...</p>}>
                    <ProjectsList />
                </Suspense>
                <p>Add Project</p>
                <Suspense fallback={<p>Loading...</p>}>
                    <FormTagLoader />
                </Suspense>
                <p>Tags</p>
                <Suspense fallback={<p>Loading...</p>}>
                    <TagsList />
                </Suspense>
                <TagForm />
            </div>
        </div>
    )
}

export default Page;