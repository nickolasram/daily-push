"use server"

import {PushCognitoClass, PushDynamoArticle} from "@/classes";
import {
    articleAdminFormSettings,
    listAndKVReference,
    PushArticle,
    PushArticleSummary,
    suggestKVFieldValue
} from "@/types";
import {Suspense} from "react";
import PushArticlePreview from "@/components/pushArticlePreview";
import Link from "next/link";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {getDynamoClient} from "@/globalFunctions/functions";
import PushArticleDisplay from "@/components/pushArticleDisplay";
import ArticleEditClientWrapper from "@/app/(private)/articles/components/articleEditClientWrapper";
import ArticleWriteClientWrapper from "@/app/(private)/articles/components/articleWriteClientWrapper";
import {getSession} from "@/session/actions";

const Page=async(
    {
        params,
    }:
    {params: Promise<{slug: string,option:string[]}>
    }
)=>{
    const {slug,option}= await params;
    const userSub = await getSession().then(data=>data.sub as string);
    const users = await PushCognitoClass.listAllUsers()
    const userReferenceKVs = (users.Users??[]).map(user => {
        const sub = user.Attributes!.find(obj=>obj.Name=='sub')?.Value??'User sub not found'
        if (sub) {
            return {
                display: user.Attributes!.find(obj=>obj.Name=='preferred_username')?.Value??'Username not found',
                value: sub
            } as listAndKVReference
        } else {
            return {
                display: user.Attributes!.find(obj=>obj.Name=='preferred_username')?.Value??'Username not found',
                value: sub
            }
        }
    })
    const adminSettings:articleAdminFormSettings = {
        reference: [],
        suggested: []
    }
    let articleSummaries:{ summary:PushArticleSummary,id:string }[] = [];
    let article: PushArticle|undefined;
    const suggestedKVs:suggestKVFieldValue[] = []
    const kvReferences:listAndKVReference[] = []
    if (slug==='view') {
        const articles = await PushDynamoArticle.getAllArticles();
        articleSummaries = articles.map(article=>{
            return {
                summary: article.plainSummary(),
                id: article.articleId!
            }
        })
    } else {
        const setReferences =()=>{
            for (const user of users.Users!) {
                const sub = user.Attributes!.find(obj=>{return obj.Name === 'sub'})
                const pUsername = user.Attributes!.find(obj=>{return obj.Name === 'preferred_username'})
                if(pUsername?.Value&&sub?.Value){
                    const reference:suggestKVFieldValue={
                        value:sub.Value,
                        display:pUsername.Value,
                    }
                    suggestedKVs.push(reference)
                    kvReferences.push(reference)
                    adminSettings.reference!.push(reference)
                    adminSettings.suggested!.push(reference)
                }
            }
        }
        if (slug=='new'){
            setReferences()
        } else {
            const client = await getDynamoClient();
            const articleResponse = await PushDynamoArticle.get(client, slug)
            if (articleResponse.Item) {
                article = articleResponse.Item as PushArticle
                if (option[0]=='edit'){
                    setReferences()
                }
            }
        }
    }


    return (
        <SimpleVertical>
            <Suspense fallback={<div>Loading...</div>}>
                { slug === 'view' &&
                    <>
                        {
                            articleSummaries.map((summary,i)=>(
                                <div className={'w-full'} key={i}>
                                    <Link
                                        className={'w-full'}
                                        href={'/articles/'+summary.id+'/read'}
                                        target={'_blank'}
                                    >
                                        <PushArticlePreview
                                            article={summary.summary}
                                            style={'neon'}
                                            showAuthor={true}
                                            authorsReference={userReferenceKVs}
                                        />
                                    </Link>
                                    <div className={'w-full flex justify-between'}>
                                        <p
                                            className={`${summary.summary.published?'text-green-500':'text-red-500'} bg-black/50 px-3 text-sm md:text-md`}
                                        >
                                            {summary.summary.published?"Public":"Hidden"}
                                        </p>
                                        <p
                                            className={`${summary.summary.published?'text-green-500':'text-red-500'} bg-black/50 px-3 text-sm md:text-md`}
                                        >
                                            {summary.summary.latestSavedDate==summary.summary.latestUpdatedDate?"Published Up to Date":"Published Not Up to Date"}
                                        </p>
                                        <Link
                                            className={'flex gap-1 items-center text-sm md:text-md'}
                                            href={'/articles/'+summary.id+'/edit'}
                                            target={'_blank'}
                                        >
                                            <p>Jump to Edit</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                }
                { slug === 'new' &&
                    <ArticleWriteClientWrapper
                        userSub={userSub!}
                        adminSettings={adminSettings}
                        suggestedKVs={suggestedKVs}
                        kvReferences={kvReferences}
                        authorKV={
                            {
                                key: 'Author',
                                value: userSub ?? '',
                                object: true,
                                hidden: false
                            }
                        }
                    />
                }
                { slug !== 'view' && slug !== 'new' &&
                    <>
                        { article &&
                            <>
                                { option[0] == 'edit' &&
                                    <ArticleEditClientWrapper
                                        passedArticle={article}
                                        suggestedKVs={suggestedKVs}
                                        kvReferences={kvReferences}
                                    />
                                }
                                { option[0] != 'view' && option[0] != 'edit' &&
                                    <div>
                                        <div
                                            className={'w-full flex justify-end '}
                                        >
                                            <Link
                                                className={'flex w-fit bg-black/40 border-white border-2 gap-2 items-center rounded-full px-3'}
                                                href={'/articles/'+article.objectId+'/edit'}
                                                target={'_blank'}
                                            >
                                                <p>
                                                    Edit Article
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                                </svg>
                                            </Link>
                                        </div>
                                        <PushArticleDisplay article={article} authorsReference={userReferenceKVs} />
                                    </div>
                                }
                            </>
                        }
                        { !article &&
                            // TODO: Make LINK
                            <div>
                                <p>
                                    Article Not Found
                                </p>
                                <p>
                                    RETURN TO SELECTION
                                </p>
                            </div>
                        }
                    </>
                }
            </Suspense>
        </SimpleVertical>
    )
}

export default Page;