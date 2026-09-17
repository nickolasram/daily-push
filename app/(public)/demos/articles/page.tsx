"use server"

import {PushDynamoArticle} from "@/classes";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {Suspense} from "react";
import PushArticlePreview from "@/components/pushArticlePreview";
import {listAndKVReference} from "@/types";
import Link from "next/link";

const KVs:listAndKVReference[] = [
    {
        display: 'Admin',
        value: '1245a',
    }
]

export default async function Page(){
    const articles = await PushDynamoArticle.getAllPublishedArticles()
    return (
        <SimpleVertical>
            <h1>Articles Demo</h1>
            <Suspense fallback={<p>Loading...</p>}>
                { articles.map((article,i) => (
                    <Link
                        className={'w-full'}
                        key={i}
                        href={'/demos/articles/read/'+article.articleId}
                        target={'_blank'}
                    >
                        <PushArticlePreview
                            article={article.plainSummary()}
                            style={'neon'}
                            showAuthor={true}
                            authorsReference={KVs}
                        />
                    </Link>
                ))
                }
            </Suspense>
        </SimpleVertical>
    )
}