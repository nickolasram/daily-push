"use server"
export default async function Page({params}:{params:Promise<{slug: string}>}){
    const {slug} = await params;
    return (
        <div>
            <p>{slug}</p>
        </div>
    )
}