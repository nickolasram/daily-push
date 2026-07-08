"use server"

import { Suspense } from "react";
import ProjectsList from "@/app/(private)/admin/components/projectsList";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";
import ProjectForm from "@/app/(private)/admin/components/projectForm";

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
                <ProjectForm />
            </div>
        </div>
    )
}

export default Page;