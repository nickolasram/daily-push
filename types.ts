import {pushFormNode} from "@/app/components/PushForm";

export interface PushProject {
    objectType: 'project',
    objectId: string,
    title: string,
    description: string,
    sick:boolean,
    away:boolean,
    date: string,
    tags: string[],
    formNodes:pushFormNode[]
}

export interface PushTag{
    objectType: 'tag',
    objectId: string,
    title: string,
}

export interface PushIdea {
    objectType: 'idea',
    objectId: string,
    idea: string,
}

export type dynamoObject = Record<string,string|number|FormDataEntryValue|object|boolean|string[]>;