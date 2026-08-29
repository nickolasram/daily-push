import {PushDynamoClass} from "@/classes";
import {SubmitEvent} from "react";
import {pushFormNode} from "@/app/components/PushForm";
import {
    DynamoDBDocumentClient,
    PutCommand,
    PutCommandOutput,
    QueryCommand,
    UpdateCommandOutput
} from "@aws-sdk/lib-dynamodb";
import {dynamoObject, PushIdea, PushProject, PushTag} from "@/types";
import {v4 as uuidv4} from "uuid";
import {getDynamoClient} from "@/globalFunctions/functions";

export class PushDynamoProject extends PushDynamoClass{
    public table:string = 'daily-push';
    public title:string;
    public description:string;
    public objectId:string;
    public sick:boolean;
    public away:boolean;
    public date: string;
    public tags: string[];
    public formNodes:pushFormNode[];


    constructor(project:PushProject);
    constructor(title:string,
                description:string,
                date:string,
                objectId:string,
                tags:string[],
                away:boolean,
                sick:boolean);
    constructor(arg1:string|PushProject,
                       description?:string,
                       date?:string,
                       objectId?:string,
                       tags?:string[],
                       away?:boolean,
                       sick?:boolean
                       ){
        super();
        if(typeof arg1 == 'string'){
            if (date == undefined){
                throw new TypeError("Date must be defined");
            }
            if (description == undefined){
                throw new TypeError("Description must be defined");
            }
            if (objectId == undefined){
                throw new TypeError("objectId must be defined");
            }
            this.title = arg1;
            this.description = description;
            this.objectId = objectId;
            this.tags = tags??[];
            this.sick = sick??false;
            this.away = away??false;
            this.date = date;
        } else {
            this.title = arg1.title??'';
            this.description = arg1.description??'';
            this.objectId = arg1.objectId??'';
            this.tags = arg1.tags??[];
            this.away = arg1.away??false;
            this.sick = arg1.sick??false;
            this.date = arg1.date??'';
        }
        this.formNodes = [
            {
                name: 'title',
                type: 'text',
                label: 'Title',
                defaultValue: this.title
            },
            {
                name: 'date',
                type: 'date',
                label: 'Date',
                defaultValue: this.date
            },
            {
                name: 'missed',
                type: 'check',
                label: 'Reason for Missing',
                options: [
                    {
                        value: 'away',
                        label: 'Away from Home',
                        defaultChecked: this.away
                    },
                    {
                        value: 'sick',
                        label: 'Sick',
                        defaultChecked: this.sick
                    },
                ]
            },
            {
                type: 'tags',
                name: 'tags',
                tags: [],
                defaultTags:this.tags
            },
            {
                type: 'richTextField',
                name: 'description',
                label: 'Description',
                defaultValue: this.description
            }
        ]
    }

    public static formattedFormValues(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const data = new FormData(event.target);
        const tags = data.getAll('tags') as string[];
        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const date = data.get('date') as string;
        const away = data.get('away') as string;
        const sick = data.get('sick') as string;
        return {
            tags: tags,
            title: title,
            description: description,
            date: date,
            away: !!(away && away == 'on'),
            sick: !!(sick && sick == 'on')
        }
    }

    public static detectedChanges(event:SubmitEvent<HTMLFormElement>,oldPushProject:PushProject){
        const formValues = PushDynamoProject.formattedFormValues(event);
        function arraysEqual(a:string[], b:string[]) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        }
        return {
            tags: !arraysEqual(oldPushProject.tags.sort(),formValues.tags.sort())?formValues.tags:undefined,
            title: formValues.title!=oldPushProject.title?formValues.title:undefined,
            description: formValues.description!=oldPushProject.description?formValues.description:undefined,
            date: formValues.date!=oldPushProject.date?formValues.date:undefined,
            away: formValues.away!=oldPushProject.away?formValues.away:undefined,
            sick: formValues.sick!=oldPushProject.sick?formValues.sick:undefined
        } as dynamoObject;
    }

    public plainObject():PushProject{
        return {
            away: this.away,
            date: this.date,
            description: this.description,
            objectId: this.objectId,
            objectType: "project",
            sick: this.sick,
            tags: this.tags,
            title: this.title,
            formNodes:this.formNodes,
        }
    }

    public static patch(client:DynamoDBDocumentClient,
                        detectedChanges:dynamoObject,
                        objectId:string
                        ):Promise<UpdateCommandOutput>{
        if (objectId===''){
            throw new Error('no objectId provided')
        }
        return PushDynamoClass.dynamoPatch(
            client,
            'daily-push',
            {
                objectType:'project',
                objectId:objectId,
            },
            detectedChanges
        )
    }

    public static get(client:DynamoDBDocumentClient,objectId:string){
        return PushDynamoClass.dynamoGet(client,'daily-push',{objectType: 'project',objectId:objectId});
    }

    public static async getAllQuery(){
        const allProjects = new QueryCommand({
            TableName:'daily-push',
            KeyConditionExpression: 'objectType = :pr',
            ExpressionAttributeValues: {
                ':pr': 'project'
            }
        })
        const c = await getDynamoClient()
        const q = await c.send(allProjects)
        return q.Items??[];
    }

    public static async getAllProjects(){
        const q = await PushDynamoProject.getAllQuery() as PushProject[];
        return q.map(project => {
            return new PushDynamoProject(project);
        })
    }

    public static async post(client:DynamoDBDocumentClient,
                            object:PushProject):Promise<PutCommandOutput>{
        let newId = uuidv4();
        let potentialObject = await PushDynamoProject.get(client,newId);
        while(potentialObject.Item){
            newId = uuidv4();
            potentialObject = await PushDynamoProject.get(client,newId);
        }
        const newItem:dynamoObject={
            ...object,
            objectType: 'project',
            objectId:newId,
        }
        const putCommand = new PutCommand({
            TableName: 'daily-push',
            Item: newItem
        })
        return client.send(putCommand);
    }

    public static delete(client:DynamoDBDocumentClient,objectId:string){
        return super.dynamoDelete(
            client,
            'daily-push',
            {
                objectType: 'project',
                objectId:objectId
            }
        )
    }
}

export class PushDynamoTag extends PushDynamoClass{
    public objectId:string;
    public title:string;

    constructor(tag:PushTag)
    constructor(title:string,objectId:string)
    constructor(arg1:string|PushTag,objectId?:string) {
        super();
        if (typeof arg1 == 'string') {
            if (!objectId || objectId==''){
                throw new Error('no objectId provided')
            }
            this.objectId = objectId;
            this.title = arg1;
        } else {
            this.objectId = arg1.objectId;
            this.title = arg1.title;
        }
    }

    public static formattedFormValues(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const data = new FormData(event.target);
        const title = data.get('title');
        if(title==undefined||title==''){
            throw new Error('title is required');
        }
        return title;
    }

    public static get(client:DynamoDBDocumentClient,objectId:string){
        return PushDynamoClass.dynamoGet(client,'daily-push',{objectType: 'tag',objectId:objectId});
    }

    public static async post(client:DynamoDBDocumentClient,title:string){
        let newId = uuidv4();
        let potentialTag = await PushDynamoTag.get(client,newId);
        while(potentialTag.Item){
            newId = uuidv4();
            potentialTag = await PushDynamoTag.get(client,newId);
        }
        const newTag:PushTag={
            title:title,
            objectType: "tag",
            objectId:newId,
        }

        const putCommand = new PutCommand({
            TableName: 'daily-push',
            Item: newTag
        })

        return client.send(putCommand);
    }

    public static delete(client:DynamoDBDocumentClient,objectId:string){
        return super.dynamoDelete(
                client,
                'daily-push',
                {
                    objectType: 'tag',
                    objectId:objectId
                }
            )
    }

    public static patch(client:DynamoDBDocumentClient,
                        title:string,
                        objectId:string,){
        if (objectId===''){
            throw new Error('no objectId provided')
        }
        if (title===''||!title){
            throw new Error('no title provided')
        }
        return PushDynamoClass.dynamoPatch(
            client,
            'daily-push',
            {
                objectType:'tag',
                objectId:objectId,
            },
            {title:title}
        )
    }
}

export class PushDynamoIdea extends PushDynamoClass{
    public objectId:string;
    public idea:string;

    constructor(idea:PushIdea);
    constructor(idea:string,objectId:string);
    constructor(idea:string|PushIdea,objectId?:string) {
        super();
        if (typeof idea=='string'){
            if (objectId!=''||!objectId){
                throw new Error('no objectId provided')
            }
            if (idea==''){
                throw new Error('no idea value provided')
            }
            this.idea=idea;
            this.objectId=objectId;
        } else{
            this.idea=idea.idea;
            this.objectId=idea.objectId;
        }
    }

    public static formattedFormValues(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const data = new FormData(event.target);
        const idea = data.get('idea');
        if(idea==undefined||idea==''){
            throw new Error('idea value is required');
        }
        return idea;

    }

    public static get(client:DynamoDBDocumentClient,objectId:string){
        return PushDynamoClass.dynamoGet(client,'daily-push',{objectType: 'idea',objectId:objectId});
    }

    public static async post(client:DynamoDBDocumentClient,idea:string){
        let newId = uuidv4();
        let potentialIdea = await PushDynamoIdea.get(client,newId);
        while(potentialIdea.Item){
            newId = uuidv4();
            potentialIdea = await PushDynamoIdea.get(client,newId);
        }
        const newIdea:PushIdea={
            idea:idea,
            objectType: "idea",
            objectId:newId,
        }

        const putCommand = new PutCommand({
            TableName: 'daily-push',
            Item: newIdea
        })

        return client.send(putCommand);
    }

    public static patch(client:DynamoDBDocumentClient,
                        idea:string,
                        objectId:string,){
        if (objectId===''){
            throw new Error('no objectId provided')
        }
        if (idea===''||!idea){
            throw new Error('no idea provided')
        }
        return PushDynamoClass.dynamoPatch(
            client,
            'daily-push',
            {
                objectType:'idea',
                objectId:objectId,
            },
            {idea:idea}
        )
    }

    public static delete(client:DynamoDBDocumentClient,objectId:string){
        return super.dynamoDelete(
            client,
            'daily-push',
            {
                objectType: 'idea',
                objectId:objectId
            }
        )
    }
}