"use server"

import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {listAndKVReference, PushArticleSummary} from "@/types";
import PushArticlePreview from "@/components/pushArticlePreview";

interface props{
    list:PushArticleSummary[];
    references:listAndKVReference[];
}

const ViewList =async({list,references}:props)=>{
    return (
        <SimpleVertical>
            { list.map((article,i) =>{
                return (
                    <PushArticlePreview
                        article={article}
                        style={'neon'}
                        showAuthor={true}
                        authorsReference={references}
                        key={i}
                    />
                )
            })

            }
        </SimpleVertical>
    )
}

export default ViewList;