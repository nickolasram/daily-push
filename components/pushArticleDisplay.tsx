"use server"

import {listAndKVReference, PushArticle} from "@/types";
import Image from 'next/image'
import TipTapText from "@/app/components/tiptapText";

interface props {
    article:PushArticle,
    authorsReference?:(listAndKVReference|undefined)[];
}

const shimmer = () => `
<svg width="250" height="250" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#bbb" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#bbb" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="250" height="250" fill="#bbb" />
  <rect id="r" width="250" height="250" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-250" to="250" dur="500ms" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
    typeof window === "undefined"
        ? Buffer.from(str).toString("base64")
        : window.btoa(str);

const PushArticleDisplay=({article,authorsReference}:props)=>{
    const visibleContributors = article.contributors.filter(obj=>(!obj.hidden))
    const contributorAlias = visibleContributors.map(obj=>{
        if (obj.object){
            const name = (authorsReference??[]).find(ref=>{
                return(ref?.value==obj.value)
            })?.display??'[user not found]'
            return (
                `${obj.key}: ${name}`
            )
        } else {
            return `${obj.key}: ${obj.value}`
        }
    })
    return (
        <div className={'border bg-white w-4xl max-w-[90dvw] text-black my-6 flex flex-col gap-6 py-6 items-center px-6'}>
            <div className={'w-full text-center'}>
                <h1>{article.heading}</h1>
                {article.subheading &&
                    <p className={'italic'}>{article.subheading}</p>
                }
            </div>
            {article.headerImage &&
             <div className={'w-full h-60 place-content-center flex justify-center'}>
                 <Image
                     src={article.headerImage}
                     alt={'Article Header Image'}
                     width={240}
                     height={240}
                     placeholder={`data:image/svg+xml;base64,${toBase64(shimmer())}`}
                     style={
                        {
                            objectFit: 'contain',
                        }
                     }
                 />
             </div>
            }
            <div className={'w-full'}>
                { contributorAlias.map((alias,i)=>(
                        <p className={'text-left w-full'} key={i}>{alias}</p>
                    ))}
            </div>
            <div className={'w-full'}>
                <TipTapText text={article.publishedContent??'<p>Nothing Here Yet :(</p>'} />
            </div>
        </div>
    )
}

export default PushArticleDisplay;