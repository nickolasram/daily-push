"use server";

import SimpleVertical from "@/app/components/frameworks/simpleVertical";
import PushMenuBtn from "@/app/components/pushMenuBtn";
import {PushDynamoProject} from "@/models";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {getDynamoClient} from "@/globalFunctions/functions";
import ProjectSquare from "@/app/components/projectSquare";
import LeftWrapJustifyCenterContainer from "@/app/components/frameworks/leftWrapJustifyCenterContainer";
import Link from "next/link";

async function getTags() {
    const allTags = new QueryCommand({
        TableName:'daily-push',
        KeyConditionExpression: 'objectType = :ta',
        ExpressionAttributeValues: {
            ':ta': 'tag'
        }
    })
    const client = await getDynamoClient()
    const response = await client.send(allTags);
    return response.Items;
}

export default async function Home() {
    const projects = await PushDynamoProject.getAllProjects()
    const tagsRaw = await getTags();
    const tagsRefined = (tagsRaw as {title:string,objectId:string}[]).map(tag =>({value:tag.objectId,display:tag.title}))
  return (
      <SimpleVertical>
        <h1>Daily-Push!</h1>
          <p>
              Thank you for visiting daily-push.com! I am an aspiring web developer who graduated recently with a degree in web application development.
              I have not, unfortunately, been able to secure a job in the industry yet. To help my chances of securing a job I have been working on a few
              independent projects to bolster my resume. I even found a client to develop a website for. However, recently my client has entered a new, very
              exciting business partnership and it is unclear if they will need the website going forward. So with that project on hiatus/potentially cancelled,
              I will be focusing on finishing my older independent projects. While the client website was near publishing, the independent projects will still take
              a while until they are ready, but I would like to have something, anything actually up on the web. Thus, this website. The goal of this website is to <b>push</b> a
              new update to github <b>daily</b> containing ready-to-publish content usually as self-contained pages or modules I use as an excuse to explore design ideas,
              review concepts, and build prototypes that will be incorporated into larger projects.
          </p>
          { projects!.length == 0 &&
              <p>no projects found</p>
          }
          { projects!.length > 0 &&
              <LeftWrapJustifyCenterContainer>
                  { projects!.map((project,i) => {
                      return (
                          <Link
                            href={'/project/'+project.date}
                            key={i}
                            target={'_blank'}
                          >
                              <PushMenuBtn
                                  btnStyle={'neon'}
                                  rounded={'rounded-md'}
                                  >
                                  <ProjectSquare project={project.plainObject()} tags={tagsRefined} />
                              </PushMenuBtn>
                          </Link>
                      )
                  })
                  }
              </LeftWrapJustifyCenterContainer>
          }
      </SimpleVertical>
  )
}

// TODO: Make Links
