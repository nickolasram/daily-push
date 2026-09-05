import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    UpdateCommandOutput,
    DeleteCommand, PutCommand
} from "@aws-sdk/lib-dynamodb";
import {providedKVFieldValues, dynamoObject, KVRecord, KVReference, PushArticle, suggestKVFieldValue} from "@/types";
import {v4 as uuidv4} from "uuid";
import {SubmitEvent} from "react";
import {pushFormNode} from "@/app/components/PushForm";
import ArticleControls from "@/app/components/articleControls";

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
    public adminId:string[];
    public headerImage:string|undefined;
    public formNodes:pushFormNode[];
    public contributors:KVRecord[]|undefined;

    constructor();
    constructor(article?:PushArticle){
        super();
        this.articleId = article?.articleId;
        this.heading = article?.heading;
        this.subheading = article?.subheading;
        this.firstPublishedDate = article?.firstPublishedDate;
        this.latestUpdatedDate = article?.latestUpdatedDate;
        this.savedContent = article?.savedContent;
        this.lastSavedDate = article?.lastSavedDate;
        this.adminId = article?.adminId??[];
        this.headerImage = article?.headerImage;
        this.publishedContent = article?.publishedContent;
        this.published = article?.published??false;
        this.formNodes = [
            { name: 'heading', type: 'text', label: 'Heading', defaultValue: this.heading},
            { name: 'subheading', type: 'text', label: 'Subheading', defaultValue: this.heading},
            { name: 'headerImage', type: 'image', label: 'Header Image', defaultValue: this.headerImage},
            { name: 'contributors', type: 'keyValueField', label: 'Contributors', providedKVs:article?.contributors?{defaultRecords:article.contributors,reference:[]}:undefined},
            { name: 'content', type:'richTextField', label: 'Body', defaultValue:this.savedContent },
        ]
    }

    private handleKVs(records:Record<string,string>[]){

    }

    public setHeadingLabel(newLabel:string){
        this.formNodes[0].label = newLabel;
    }

    public setSubheadingLabel(newLabel:string){
        this.formNodes[1].label = newLabel;
    }

    public hideSubheadingField():void{
        this.formNodes = this.formNodes.splice(1,1)
    }

    public hideHeaderImageField():void{
        this.formNodes = this.formNodes.filter((formNode)=>{return formNode.name!=='headerImage';})
    }

    public setSuggestedKVs(suggestedKVs:suggestKVFieldValue[]){
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        this.formNodes[kvIndex]['suggestedKVs'] = suggestedKVs
    }

    public setDefaultKVs(providedKVs:KVRecord[]){
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        if (this.formNodes[kvIndex]['providedKVs']){
            this.formNodes[kvIndex]['providedKVs'].defaultRecords = providedKVs
        } else {
            this.formNodes[kvIndex]['providedKVs'] = {
                defaultRecords:providedKVs,
                reference:[]
            }
        }
    }

    public setKVReference(reference:KVReference[]){
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        if (this.formNodes[kvIndex]['providedKVs']){
            this.formNodes[kvIndex]['providedKVs'].reference = reference
        } else {
            this.formNodes[kvIndex]['providedKVs'] = {
                defaultRecords:[],
                reference:reference
            }
        }
    }

    public autoIncludeUser(details:{defaultKey:string,value:string,reference:boolean}):void{
        const kvIndex = this.formNodes.findIndex((formNode)=>{return formNode.type=='keyValueField'})
        const userRecord:KVRecord={
            key:details.defaultKey,
            value:details.value,
            object: details.reference,
            hidden:false
        }
        if (this.formNodes[kvIndex]['providedKVs']){
            const userAlreadyExists = this.formNodes[kvIndex]['providedKVs']?.defaultRecords.find(
                obj=>{return obj.value==details.value}
            )
            if (userAlreadyExists){
                return
            } else {
                this.formNodes[kvIndex]['providedKVs'].defaultRecords.push(
                    userRecord
                )
            }
        } else {
            this.formNodes[kvIndex]['providedKVs'] = {
                defaultRecords:[userRecord],
                reference:[]
            }
        }

    }

    public altControls(){
        return ArticleControls
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