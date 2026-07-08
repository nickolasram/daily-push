export interface PushProject {
    objectType: 'project',
    objectId: string,
    title: string,
    description: string,
    sick:boolean,
    away:boolean
}

export interface PushTag{
    objectType: 'tag',
    objectId: string,
    title: string,
}