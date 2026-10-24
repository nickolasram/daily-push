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
                    <div className={'w-full'}>
                        <div className={'w-full flex justify-between pb-6'}>
                            <Link
                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 items-center justify-center rounded-full px-3'}
                                href={'/admin'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                                <p>
                                    Admin Page
                                </p>
                            </Link>
                            <Link
                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 justify-center items-center rounded-full px-3'}
                                href={'/articles/new'}
                            >
                                <p>
                                    New Article
                                </p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                        {
                            articleSummaries.map((summary,i)=>(
                                <div className={'w-full mb-6'} key={i}>
                                    <Link
                                        className={'w-full'}
                                        href={'/articles/'+summary.id+'/read'}
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
                    </div>
                }
                { slug === 'new' &&
                    <div className={'w-full flex flex-col items-center'}>
                        <div className={'w-full'}>
                            <Link
                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 items-center justify-center rounded-full px-3'}
                                href={'/articles/view'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                                <p>
                                    Article Selection
                                </p>
                            </Link>
                        </div>
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
                    </div>
                }
                { slug !== 'view' && slug !== 'new' &&
                    <>
                        { article &&
                            <>
                                { option[0] == 'edit' &&
                                    <div className={'flex flex-col items-center w-full'}>
                                        <div className={'w-full'}>
                                            <Link
                                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 items-center justify-center rounded-full px-3'}
                                                href={'/articles/view'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                                </svg>
                                                <p>
                                                    Article Selection
                                                </p>
                                            </Link>
                                        </div>
                                        <ArticleEditClientWrapper
                                            passedArticle={article}
                                            suggestedKVs={suggestedKVs}
                                            kvReferences={kvReferences}
                                        />
                                    </div>
                                }
                                { option[0] != 'view' && option[0] != 'edit' &&
                                    <div>
                                        <div
                                            className={'w-full flex justify-between'}
                                        >
                                            <Link
                                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 items-center justify-center rounded-full px-3'}
                                                href={'/articles/view'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                                </svg>
                                                <p>
                                                    Article Selection
                                                </p>
                                            </Link>
                                            <Link
                                                className={'flex w-50 bg-black/40 border-white border-2 gap-2 justify-center items-center rounded-full px-3'}
                                                href={'/articles/'+article.objectId+'/edit'}
                                            >
                                                <p>
                                                    Edit Article
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </div>
                                        <PushArticleDisplay article={article} authorsReference={userReferenceKVs} />
                                    </div>
                                }
                            </>
                        }
                        { !article &&
                            <div className={'w-full flex flex-col min-h-100 bg-black/50 rounded-2xl mt-20 h-full justify-center items-center'}>
                                <p className={'text-center'}>
                                    Article Not Found
                                </p>
                                <Link
                                    href={'/articles/view'}
                                    className={'underline'}
                                >
                                    RETURN TO SELECTION
                                </Link>
                            </div>
                        }
                    </>
                }
            </Suspense>
        </SimpleVertical>
    )
}

export default Page;