import {PushArticleSummary} from "@/types";

interface papProps{
    article:PushArticleSummary;
    rounded?:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string;
    style?:'neon'|'marbleBtn'|string;
}

const PushArticlePreview=({article,rounded,style}:papProps)=>{
    return (
        <div className={`w-full ${style=='neon'?'border-6 border-neon-cyan text-black bg-white':'border'} ${rounded??'rounded-xs'} p-3`}>
            <p className={'font-semibold'}>{article.heading}</p>
        </div>
    )
}

export default PushArticlePreview;