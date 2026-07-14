export interface PushProject {
    objectType: 'project',
    objectId: string,
    title: string,
    description: string,
    sick:boolean,
    away:boolean,
    date: string,
    tags: string[],
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