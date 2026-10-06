"use server"
import {PushDynamoArticle} from "@/classes";
import {getSession} from "@/session/actions";

const Page=async ()=>{
    const session = await getSession();
    const userSub = session.sub;
    // const article = new PushDynamoArticle(userSub);
    return (
        <div>
            <p>write</p>
        </div>
    )
}

export default Page;