"use server"

import {PushCognitoClass, PushDynamoArticle} from "@/classes";
import {listAndKVReference, PushArticleSummary} from "@/types";
import {Suspense} from "react";
import PushArticlePreview from "@/components/pushArticlePreview";
import Link from "next/link";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";

const Page=async(
    {
        params,
    }:
    {params: Promise<{slug: string,option:string[]}>
    }
)=>{
    const {slug,option}= await params;
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
    let articleSummaries:{ summary:PushArticleSummary,id:string }[] = [];
    if (slug==='view') {
        const articles = await PushDynamoArticle.getAllPublishedArticles()
        articleSummaries = articles.map(article=>{
            return {
                summary: article.plainSummary(),
                id: article.articleId!
            }
        })
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
                                        href={'/articles/'+summary.id}
                                        target={'_blank'}
                                    >
                                        <PushArticlePreview
                                            article={summary.summary}
                                            style={'neon'}
                                            showAuthor={true}
                                            authorsReference={userReferenceKVs}
                                        />
                                    </Link>
                                    <div className={'w-full flex justify-end'}>
                                        <p>Edit &gt;&gt;</p>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                }
                { slug !== 'view' &&
                    <p>{option[0]}</p>
                }
            </Suspense>
        </SimpleVertical>
    )
}

export default Page;