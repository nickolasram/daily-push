import {listAndKVReference, PushArticleSummary} from "@/types";

interface papProps{
    article:PushArticleSummary;
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string;
    style?:'neon'|'marbleBtn'|string;
    showAuthor?: boolean;
    authorsReference?:listAndKVReference[];
}

const PushArticlePreview=({article,rounded,style,showAuthor,authorsReference}:papProps)=>{
    const visibleContributors = article.contributors.filter(obj=>(!obj.hidden))
    const contributorAlias = visibleContributors.map(obj=>{
        if (obj.object){
            return (
                (authorsReference??[]).find(ref=>{
                    return(ref.value==obj.value)
                })?.display??'[user not found]'
            )
        } else {
            return obj.value
        }
    })
    const sortedContributors = contributorAlias.sort((objA,objB)=>{return objA.localeCompare(objB)});
    const contributorString = sortedContributors.join(', ');
    let timestamp;
    if (article.firstPublishedDate==article.latestUpdatedDate){
        timestamp = 'Posted'
    } else {
        timestamp = 'Updated'
    }
    return (
        <div className={`w-full ${style=='neon'?'border-6 border-neon-cyan text-black bg-white':'border'} ${rounded??'rounded-xs'} p-3`}>
            <div className={'w-full flex justify-between'}>
                <p className={'font-semibold text-2xl'}>{article.heading}</p>
                <div>
                    <p>{timestamp}</p>
                    <p>
                        {new Date((article.latestUpdatedDate??article.firstPublishedDate)??'').toLocaleString(undefined, {
                                year: '2-digit',
                                month:'numeric',
                                day:'numeric',
                                hour:'numeric',
                                minute:'numeric',
                                })}
                    </p>
                </div>
            </div>
            { !!showAuthor &&
                <div>
                    <p>By {contributorString}</p>
                </div>
            }
        </div>
    )
}

export default PushArticlePreview;