import {listAndKVReference, PushArticle} from "@/types";

interface props {
    article:PushArticle,
    authorsReference?:listAndKVReference[];
}

const PushArticleDisplay=({article,authorsReference}:props)=>{
    const visibleContributors = article.contributors.filter(obj=>(!obj.hidden))
    const contributorAlias = visibleContributors.map(obj=>{
        if (obj.object){
            const name = (authorsReference??[]).find(ref=>{
                return(ref.value==obj.value)
            })?.display??'[user not found]'
            return (
                `${obj.key}: ${name}`
            )
        } else {
            return `${obj.key}: ${obj.value}`
        }
    })
    return (
        <div className={'border bg-white w-4xl max-w-[90dvw] text-black my-6 flex flex-col gap-6 py-6 items-center'}>
            <h1>{article.heading}</h1>
            { contributorAlias.map((alias,i)=>(
                <p key={i}>{alias}</p>
            ))
            }
        </div>
    )
}

export default PushArticleDisplay;