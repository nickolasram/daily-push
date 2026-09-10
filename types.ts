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

export interface PushSortingFilterOption{
    label: string;
    sortingFunction: (obj1:object,obj2:object,polarity?:number)=>number;
}

export interface PushArticle {
    heading:string;
    subheading:string|undefined;
    articleId:string;
    firstPublishedDate:string|Date|undefined;
    latestUpdatedDate:string|Date|undefined;
    savedContent:string;
    publishedContent:string|undefined;
    published:boolean;
    lastSavedDate:string|Date|undefined;
    formSettings: articleFormSettings;
    adminSettings: articleAdminSetting[];
    headerImage:string|undefined;
    objectType:'article';
    contributors:KVRecord[];
}

export interface KVRecord{
    key:string,
    value:string,
    object:boolean,
    hidden:boolean,
}

export interface listAndKVReference{
    value:string;
    display:string;
}

export type suggestKVFieldValue = string | {value:string,display:string}

export interface ListFieldEntry{
    value:string;
    object:boolean;
    hidden:boolean;
}

export type suggestListFieldValue = string | {value:string,display:string}

export interface articleAdminSetting{
    id: string,
    permission: 'creator'|'admin'|'editor'|'reviewer',
    reference:boolean
}

export interface articleFormSettings{
    headingLabel?:string;
    subheadingLabel?:string;
    hideSubheading?:boolean;
    hideHeaderImage?:boolean;
    suggestedKVs?:suggestKVFieldValue[];
    providedKVs?:KVRecord[];
    kvReference?:listAndKVReference[];
}

export interface articleAdminSettings{
    reference?:listAndKVReference[];
    suggested?:suggestListFieldValue[];
}