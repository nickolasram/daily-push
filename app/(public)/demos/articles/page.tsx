"use server"

import {PushDynamoArticle} from "@/classes";
import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import {Suspense} from "react";
import PushArticlePreview from "@/components/pushArticlePreview";

export default async function Page(){
    const articles = await PushDynamoArticle.getAllPublishedArticles()
    return (
        <SimpleVertical>
            <h1>Articles Demo</h1>
            <Suspense fallback={<p>Loading...</p>}>
                { articles.map((article,i) => (
                  <PushArticlePreview
                      article={article.plainObject()}
                      key={i}
                      style={'neon'}
                  />
                ))
                }
            </Suspense>
        </SimpleVertical>
    )
}