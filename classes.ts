import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    UpdateCommandOutput,
    DeleteCommand, PutCommand
} from "@aws-sdk/lib-dynamodb";
import {
    dynamoObject,
    KVRecord,
    PushArticle,
    suggestKVFieldValue,
    articleFormSettings, articleAdminSetting, listAndKVReference, ListFieldEntry, articleAdminSettings
} from "@/types";
import {v4 as uuidv4} from "uuid";
import {SubmitEvent} from "react";
import {pushFormNode} from "@/app/components/PushForm";

export abstract class PushDynamoClass {

    // No Post Method is outlined, even abstractly, as different objects may use compound or single p-keys with different names

    protected static dynamoGet(client:DynamoDBDocumentClient,
                        table:string,
                        key:dynamoObject){
        const getCommand = new GetCommand({
            TableName: table,
            Key: key
        });
        return client.send(getCommand);
    }

    protected static dynamoPatch(
        client:DynamoDBDocumentClient,
        table:string,
        key:dynamoObject,
        changes:dynamoObject
    ):Promise<UpdateCommandOutput>{
        const commands:string[] = [];
        const expressionAttributeValues:dynamoObject = {};
        const expressionAttributeNames:Record<string, string> = {};
        const keys = Object.keys(changes);
        for (const key of keys) {
            let attributeAlias = key[0];
            while (expressionAttributeNames['#'+attributeAlias]) {
                attributeAlias = attributeAlias + "a";
            }
            expressionAttributeNames['#'+attributeAlias] = key;
            commands.push(`#${attributeAlias} = :${attributeAlias}`);
            expressionAttributeValues[`:${attributeAlias}`] = changes[key];
        }
        const updateExpression = `SET ${commands.join(', ')}`
        const updateCommand = new UpdateCommand({
            TableName: table,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        });
        return client.send(updateCommand);
    }

    protected static dynamoDelete(client:DynamoDBDocumentClient,
                           table:string,
                           key:dynamoObject){
        const deleteCommand = new DeleteCommand({
            TableName: table,
            Key: key
        })
        return client.send(deleteCommand);
    }
}

export class PushDynamoArticle extends PushDynamoClass{
    public articleId:string|undefined;
    public heading:string|undefined;
    public subheading:string|undefined;
    public firstPublishedDate:string|Date|undefined;
    public latestUpdatedDate:string|Date|undefined;
    public savedContent:string|undefined;
    public publishedContent:string|undefined;
    public published:boolean;
    public lastSavedDate:string|Date|undefined;
    public headerImage:string|undefined;
    public formNodes:pushFormNode[];
    public adminFormNodes:pushFormNode[];
    public contributors:KVRecord[]|undefined;
    public formSettings: articleFormSettings;
    public adminSettings: articleAdminSetting[];

    constructor(arg1:PushArticle|string);
    constructor(arg1:PushArticle|string,
                arg2?:boolean); // if values in both admin list and contributors list are either references or not
    constructor(arg1:PushArticle|string,
                arg2?:boolean, // if values in admin list can be references but not in contributors list and vice versa. arg 2 is for the admin list
                SmartKVReference?:boolean) {
        super();
        let provided:KVRecord[];
        let KVReference:boolean;
        if (SmartKVReference) {
            KVReference = SmartKVReference;
        } else KVReference = !!arg2;
        let creatorValue:string;
        if (typeof arg1 == 'string') {
            this.published = false;
            this.adminSettings = [{
                id: arg1,
                permission:'creator',
                reference:!!arg2
            }]
            creatorValue = arg1
            const defaultUser:KVRecord = {
                key:'Author',
                value:arg1,
                hidden:false,
                object:KVReference
            }
            provided = [defaultUser]
            this.formSettings = {}
        } else {
            this.articleId = arg1.articleId;
            this.heading = arg1.heading;
            this.subheading = arg1.subheading;
            this.firstPublishedDate = arg1.firstPublishedDate;
            this.latestUpdatedDate = arg1.latestUpdatedDate;
            this.savedContent = arg1.savedContent;
            this.lastSavedDate = arg1.lastSavedDate;
            this.adminSettings = arg1.adminSettings;
            this.formSettings = arg1.formSettings;
            this.headerImage = arg1.headerImage;
            this.publishedContent = arg1.publishedContent;
            this.published = arg1.published;
            this.formSettings = arg1.formSettings;
            provided = arg1.contributors
            const creatorSetting = arg1.adminSettings.find(obj=>{return obj.permission == 'creator'})
            creatorValue = creatorSetting!.id
        }
        const contributorNode:pushFormNode = {
            name: 'contributors',
            type: 'keyValueField',
            label: 'Contributors',
            providedKVs:provided
        }
        this.formNodes = [
            { name: 'heading', type: 'text', label: 'Heading', defaultValue: this.heading},
            { name: 'subheading', type: 'text', label: 'Subheading', defaultValue: this.heading},
            { name: 'headerImage', type: 'image', label: 'Header Image', defaultValue: this.headerImage},
            contributorNode,
            { name: 'content', type:'richTextField', label: 'Body', defaultValue:this.savedContent },
        ]
        const admins:ListFieldEntry[] = [];
        const editors:ListFieldEntry[] = [];
        const reviewers:ListFieldEntry[] = [];
        for (const user of this.adminSettings) {
            if (user.permission=='admin'){
                admins.push({value:user.id,object:user.reference,hidden:false});
            }
            if (user.permission=='editor'){
                editors.push({value:user.id,object:user.reference,hidden:false});
            }
            if (user.permission=='reviewer'){
                reviewers.push({value:user.id,object:user.reference,hidden:false});
            }
        }
        this.adminFormNodes = [
            {
              name:'',
              type:'note',
              defaultValue: 'Created by '+creatorValue
            },
            {
                name:'admins',
                type: 'listColumn',
                label: 'Admins',
                providedListFieldEntries: admins
            },
            {
                name:'editors',
                type: 'listColumn',
                label: 'Editors',
                providedListFieldEntries: editors
            },
            {
                name:'reviewers',
                type: 'listColumn',
                label: 'Reviewers',
                providedListFieldEntries: reviewers
            },
        ]
    }

    private setContributorsReference(reference:listAndKVReference[]):void{
        const kvNode = this.formNodes.find((formNode)=>{return formNode.name==='contributors';});
        kvNode!.KVReference = reference;
    }

    private setSuggestedKVs(suggestedKVs:suggestKVFieldValue[]){
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        this.formNodes[kvIndex]['suggestedKVs'] = suggestedKVs
    }

    private setDefaultKVs(providedKVs:KVRecord[]){
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        this.formNodes[kvIndex]['providedKVs'] = providedKVs
    }

    public setFormSettings(settings:articleFormSettings){
        this.formSettings = {
            ...this.adminSettings,
            ...settings
        }
        if (settings.providedKVs){
            this.setDefaultKVs(settings.providedKVs);
        }
        if (settings.kvReference){
            this.setContributorsReference(settings.kvReference);
        }
        if (settings.suggestedKVs){
            this.setSuggestedKVs(settings.suggestedKVs);
        }
    }

    public setAdminSettings(settings:articleAdminSettings):void{
        for (const node of this.adminFormNodes) {
            if (node.type == 'note') {
                const creatorSetting = this.adminSettings.find(obj=>{return obj.permission == 'creator'})
                if (creatorSetting!.reference){
                    const creatorDisplay = settings.reference?.find(obj=>{return obj.value == creatorSetting!.id})
                    if (creatorDisplay){
                        node.defaultValue = 'Created by '+ creatorDisplay.display
                    } else {
                        node.defaultValue = 'Created by [User Not Found]'
                    }
                }
            }
            if (node.type == 'listColumn') {
                node.listFieldReference = settings.reference;
                node.suggestedListFieldValues = settings.suggested;
            }
        }
    }

    public getControlValue(event:SubmitEvent<HTMLFormElement>):'save'|'publish'{
        return event.nativeEvent.submitter?.dataset['value'] as 'save'|'publish'
    }

    public static get(client:DynamoDBDocumentClient,
                      table:string,
                      key:dynamoObject){
        return super.dynamoGet(client,table,key);
    }

    public static async post(
        client:DynamoDBDocumentClient,
        table:string,
        articleId:string,
        object:PushArticle
    ){
        let newId = uuidv4();
        let potentialObject = await PushDynamoClass.dynamoGet(client,table,{objectType: 'article',articleId:articleId});
        while(potentialObject.Item){
            newId = uuidv4();
            potentialObject = await PushDynamoArticle.get(client,table,{objectType: 'article',articleId:articleId});
        }
        const newItem:PushArticle={
            ...object,
            objectType: 'article',
            articleId:newId,
        }
        const putCommand = new PutCommand({
            TableName: table,
            Item: newItem
        })

        return client.send(putCommand);
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

    public static detectChanges(event:SubmitEvent<HTMLFormElement>,oldArticle:PushArticle,authorId:string){
        // const formValues = PushDynamoProject.formattedFormValues(event);
        function arraysEqual(a:string[], b:string[]) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        }
    }

    public static patch(client:DynamoDBDocumentClient,
                        detectedChanges:dynamoObject,
                        table:string,
                        objectId:string,){
        if (objectId===''){
            throw new Error('no objectId provided')
        }
        return super.dynamoPatch(
            client,
            table,
            {
                objectType:'article',
                objectId:objectId,
            },
            detectedChanges
        )
    }
}