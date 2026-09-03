'use client'
import {Fragment, ReactNode, RefObject, SubmitEvent, useEffect, useReducer, useRef, useState} from "react";
import {Field, Input, Label, Textarea, Checkbox, Legend, Fieldset, Radio, RadioGroup, Button} from '@headlessui/react'
import TextEditor from "@/app/components/textEditor/TextEditor";
import {defaultKVFieldValues} from "@/types";

interface keyValueBlockProps {
    name: string,
    defaultKV?:{record:{key:string,value:string},object:boolean},
    suggestedKVs?:(string|{value:string,display:string})[],
    reference?:{value:string,display:string}[]
}

export function generateKVRecord(name:string, formData:FormData) {
    const returnedRecords: { record:Record<string, string>, object:boolean }[] = []
    const recordKeys = formData.getAll(name+'Key') as [string];
    const recordValues = formData.getAll(name+'Value') as [string];
    const recordObject = formData.getAll(name+'Object') as [string];
    const listLength = recordKeys.length;
    for(let i=0;i<listLength;i++){
        returnedRecords.push(
            {
                record: {
                    key:recordKeys[i],
                    value:recordValues[i],
                },
                object:!!recordObject.find(obj=>obj==(recordValues[i]+'Object'))
            }
        )
    }
    console.log(returnedRecords)
    return returnedRecords;
}

const KeyValueBlock=({name,defaultKV,suggestedKVs,reference}:keyValueBlockProps)=>{
    let defaultDisplay = '';
    if(defaultKV){
        if(defaultKV.object){
            const referencedObject = reference?.find(obj=> {
                return obj.value == defaultKV.record.value
            })
            if(referencedObject){
                defaultDisplay = referencedObject.display
            } else {
                defaultDisplay = '[User not found]'
            }
        } else {
            defaultDisplay = defaultKV.record.value
        }
    }
    const [keyValue, setKeyValue] = useState<string>(defaultKV?defaultKV.record.key:"[empty]")
    const [valueValue, setValueValue] = useState<string>(defaultKV?defaultKV.record.value:"[empty]")
    const [valueDisplay,setValueDisplay] = useState<string>(defaultDisplay)
    const [objectBoolean,setObjectBoolean] = useState<boolean>(defaultKV?.object??false)
    const [matchingValues,setMatchingValues]=useState<(string|{display:string,value:string})[]>([])
    const handleChange=(input:string)=>{
        if(input?.length==0){
            setMatchingValues([])
        } else {
            const regexValue = input + '.*'
            const re = new RegExp(regexValue, 'i')
            setMatchingValues(suggestedKVs!.filter(ptv=> {
                    if (typeof ptv === "string") {
                        return re.test(ptv)
                    } else {
                        return re.test(ptv.display)
                    }
                }
            ))
        }
    }
    // TODO: Make more flexible width
    return(
        <div className={'flex flex-col border-black border-b-1 relative'}>
            <input className={'hidden size-0'} type={'checkbox'} name={name+'Key'} value={keyValue} defaultChecked={true} readOnly={true} />
            {defaultKV ?
                <input value={keyValue} className={'border-black w-60 border-b-1'} type={'text'}
                       onChange={(e)=> {
                           setKeyValue(e.target.value)
                       }}
                /> :
                <input placeholder={'key'} className={'border-black w-60 border-b-1'} type={'text'}
                       onChange={(e)=> {
                           setKeyValue(e.target.value)
                       }}
                />
            }
            <input className={'hidden size-0'} type={'checkbox'} name={name+'Value'} value={valueValue} defaultChecked={true} readOnly={true} />
            <input className={'hidden size-0'} type={'checkbox'} name={name+'Object'} value={valueValue+'Object'} checked={objectBoolean} readOnly={true} />
            { defaultKV ?
                <input className={'w-60 backdrop-brightness-95'} type={'text'} value={valueDisplay}
                       onBlur={()=>{
                           setMatchingValues([])
                       }}
                       onChange={(e)=> {
                           setValueValue(e.target.value);
                           setValueDisplay(e.target.value);
                           if (suggestedKVs) {
                               handleChange(e.target.value)
                           }
                       }
                       }
                />    :
                <input placeholder={'value'} className={'w-60 backdrop-brightness-95'} type={'text'} value={valueDisplay}
                       onBlur={()=>{
                           setMatchingValues([])
                       }}
                       onChange={(e)=> {
                           setValueValue(e.target.value);
                           setValueDisplay(e.target.value);
                           if (suggestedKVs) {
                               handleChange(e.target.value)
                           }
                       }
                       }
                />
            }
            { matchingValues?.length > 0 &&
                <div className={'z-10 absolute top-[100%] w-full border-black border-2 left-3  bg-white'}>
                    { matchingValues.map((v,i)=>{
                        let display:string;
                        if (typeof v==="string"){
                            display=v
                        }else{
                            display=v.display
                        }
                        return (
                            <Button
                                key={i}
                                className={'text-left cursor-pointer border-0 bg-white hover:bg-gray-300 focus:bg-gray-300 last-of-type:border-b-0 border-b-1 w-full'}
                                onClick={()=> {
                                    if (typeof v==="string"){
                                        setValueValue(v)
                                        setValueDisplay(v)
                                        setObjectBoolean(false)
                                        setMatchingValues([])
                                    } else {
                                        setValueValue(v.value)
                                        setValueDisplay(v.display)
                                        setObjectBoolean(true)
                                        setMatchingValues([])
                                    }
                                }}
                            >
                                {display}
                            </Button>
                        )
                    })
                    }
                </div>
            }
        </div>
    )
}

interface keyValueFieldProps {
    name: string,
    rounded:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
    defaultKVs?:defaultKVFieldValues,
    suggestedKVs?:(string|{value:string,display:string})[],
}

const KeyValueField=({name,rounded,defaultKVs,suggestedKVs}:keyValueFieldProps)=>{
    const [blockCount,setBlockCount]=useState(1)
    return (
        <div className={`flex flex-col border w-fit ${rounded}`}>
            {defaultKVs && defaultKVs.defaultRecords.length > 0 &&
                <>
                    {defaultKVs.defaultRecords.map((_,i)=>{
                        return(
                            <KeyValueBlock name={name} key={i} defaultKV={_} suggestedKVs={suggestedKVs} reference={defaultKVs.reference} />
                        )
                    })
                    }
                </>
            }
            { !defaultKVs &&
                <>
                    {[...Array(blockCount)].map((_,i)=>{
                        return(
                            <KeyValueBlock name={name} key={i} suggestedKVs={suggestedKVs} />
                        )
                    })
                    }
                </>
            }
            <Button
                type='button'
                onClick={()=>setBlockCount(blockCount+1)}
                className={'border-none flex gap-2 items-center'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>
                <p className={'text-sm text-gray-900'}>Add Key,Value</p>
            </Button>
        </div>
    )
}

interface TagFormProps{
    name:string,
    possibleTagValues:{display:string,value:string}[],
    defaultValues?:string[]
}

const TagForm = ({name,possibleTagValues,defaultValues}:TagFormProps)=>{
    const [matchingValues,setMatchingValues]=useState<{display:string,value:string}[]>([])
    const [verifiedTags,setVerifiedTags]=useState<string[]>(defaultValues??[])
    const inputRef = useRef<HTMLInputElement|null>(null)
    const handleChange=(input:string)=>{
        if(input?.length==0){
            setMatchingValues([])
        } else {
            const regexValue = input + '.*'
            const re = new RegExp(regexValue, 'i')
            setMatchingValues(possibleTagValues.filter(ptv=>re.test(ptv.display)))
        }
    }


    const AcceptedTag=({value}:{value:string})=>{
        const foundTag = possibleTagValues.find(tag=>tag.value===value)
        return (
            <>
                <input name={name} value={foundTag!.value} readOnly={true} className={'hidden size-0'} />
                <Button
                    type="button"
                    className={'bg-cyan-800 text-white border-3 grow-0 w-min h-min px-1 flex gap-1 items-center rounded-lg'}
                    onClick={()=>{setVerifiedTags(verifiedTags.filter(tag=>tag!==value))}}
                >
                    <p className={'text-nowrap max-w-[8ch] overflow-x-hidden text-ellipsis'}>{foundTag!.display}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>
                </Button>
            </>
        )
    }

    return (
        <div>
            <div className={'border border-black min-h-8 p-2 w-50 max-w-50 flex flex-wrap gap-2'}>
                {verifiedTags.map((v,i)=>{
                    return <AcceptedTag value={v} key={i}/>
                })
                }
                <input
                    type={'text'}
                    placeholder={'Tag...'}
                    ref={inputRef}
                    onChange={event => handleChange(event.target.value)}
                    className={'max-w-40 min-w-15 basis-0 grow'}/>
            </div>
            { matchingValues.length > 0 &&
                <div className={'border border-white flex flex-col text-white bg-gray-700 border-t-0 w-50'}>
                    { matchingValues.map((v,i)=>{
                        return (
                            <Button
                                key={i}
                                className={'text-left cursor-pointer'}
                                onClick={()=> {
                                    inputRef.current!.value=''
                                    setMatchingValues([])
                                    setVerifiedTags([...verifiedTags, v.value])
                                }}
                            >
                                {v.display}
                            </Button>
                        )
                    })
                    }
                </div>
            }
        </div>
    )
}

// TODO: Make ID optional (defaulting to name) and label mandatory
// TODO: allow default options
export interface pushFormNode {
    defaultCheckedIndex?:number,
    id?: string,
    inputRounded?: 'rounded-none' | 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    label?: string,
    labelPlacement?: 'column' | 'row',
    max?: number,
    min?: number,
    name: string,
    node?: ReactNode,
    options?:Array<{ value:string, label:string, defaultChecked?:boolean }>,
    tags?: {display:string,value:string}[],
    type: 'text' | 'number' | 'textArea' | 'richTextField' | 'file' | 'image' | 'date' | 'custom' | 'keyValueField' | 'radio' | 'check' | 'tags' | 'listColumn',
    defaultValue?: string | number,
    defaultTags?: string[],
    defaultKVs?:defaultKVFieldValues,
    suggestedKVs?:(string|{value:string,display:string})[],
//     placeholder
//     default
//     onChange
}

interface pushFormProps {
    fields: pushFormNode[],
    inputRoundedDefault?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    labelPlacementDefault?: 'column' | 'row',
    onSubmit: (event: SubmitEvent<HTMLFormElement>)=>void,
    rounded?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    ref?: RefObject<HTMLFormElement|null>,
    altControls?:ReactNode,
}

const PushForm = ({fields, onSubmit, labelPlacementDefault, rounded,inputRoundedDefault,ref,altControls}:pushFormProps)=>{
    // TODO: Right now, can only save the value of one rich text field
    const [state, dispatch] = useReducer(
        // TODO: fix typing without ignoring
        (
            state: Record<string, unknown>,
            newState: Record<string, unknown>
        ) => ({...state, ...newState}),
        {
            editorKey:0,
            defaultDescription:'',
            description:'',
            selectedImageFile:''
        }
    );
    useEffect(()=>{
        const rtfField = fields.find(obj=>(obj.type=='richTextField'))
        if (rtfField&&rtfField.defaultValue){
            dispatch({description: rtfField.defaultValue})
        }
    },[])
    const setDescription=(description:string)=>{
        dispatch({description: description})
    }
    let longestLabel:number = 0;
    for (const field of fields) {
        if (field.type != 'custom') {
            const label = field.label??field.name;
            const length = label.length;
            if (length > longestLabel) {
                longestLabel = length;
            }
        }
    }

    return (
        <form onSubmit={(event)=>{
            onSubmit(event);
        }}
          className={`p-6 w-fit bg-white text-black flex flex-col gap-3 justify-center ${rounded??'rounded-sm'}`}
          ref={ref??null}
        >
            { fields.map((field,i) =>{
                const inputClassNameDefault=`border ${field.inputRounded??inputRoundedDefault??'rounded-xs'}`
                if(field.type === 'text'){
                        return (
                            <Field key={i} className="flex"
                                   style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                                <Label
                                    style={{minWidth: longestLabel + 1 + 'ch',}}
                                >
                                    {field.label??field.name}
                                </Label>
                                <Input
                                    className={inputClassNameDefault}
                                    name={field.name}
                                    id={field.id}
                                    type="text"
                                    defaultValue={field.defaultValue??''}
                                />
                            </Field>
                        )
                    }
                else if(field.type === 'number'){
                    return (
                        <Field key={i} className="flex"
                               style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <Label
                                style={{minWidth: longestLabel + 1 + 'ch',}}
                            >
                                {field.label??field.name}
                            </Label>
                            <Input
                                className={inputClassNameDefault}
                                type="number"
                                name={field.name}
                                id={field.id}
                                min={field.min??Number.MIN_VALUE}
                                max={field.max??Number.MAX_VALUE}
                                style={{
                                    //TODO: Make width customizable
                                    maxWidth:'200px',
                                }}
                            />
                        </Field>
                    )
                }
                else if(field.type === 'richTextField'){
                    return (
                        <Fragment key={i}>
                            <p>{field.label??field.name}</p>
                            <input type={'text'} name={field.name} readOnly={true} className="hidden size-0" value={state.description as string} />
                            <div className="md:w-150 max-w-[calc(100vh - 60px)]">
                                <TextEditor
                                    ikey={state.editorKey as number}
                                    editorContent={(field.defaultValue as string)??(state.defaultDescription as string)}
                                    onChange={setDescription}
                                    editorBG={'bg-white'}
                                    defaultColor={'text-black'}
                                />
                            </div>
                        </Fragment>
                    )
                }
                else if(field.type == 'custom' && field.node){
                        return <Fragment key={i}>{field.node}</Fragment>
                }
                else if(field.type == 'keyValueField'){
                    return(
                        <div key={i} className="flex"
                                  style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <p style={{minWidth: longestLabel + 1 + 'ch',}}>{field.label??field.name}</p>
                            <KeyValueField
                                name={field.name}
                                rounded={field.inputRounded??inputRoundedDefault??'rounded-xs'}
                                suggestedKVs={field.suggestedKVs}
                                defaultKVs={field.defaultKVs}
                            />
                        </div>
                    )

                } else if(field.type == 'textArea'){
                    return(
                        <Field key={i} className="flex"
                               style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <Label
                                style={{minWidth: longestLabel + 1 + 'ch',}}
                            >
                                {field.label??field.name}
                            </Label>
                            {/*TODO: Make rows customizable*/}
                            <Textarea
                                className={inputClassNameDefault}
                                name={field.name}
                                id={field.id}
                                rows={6}
                                style={{
                                    //TODO: Make width customizable
                                    maxWidth:'200px',
                                    paddingInline:'8px',
                                }}
                            />
                        </Field>
                    )
                }
                else if(field.type == 'check') {
                    const options = field.options??[]
                    return (
                        <Fieldset key={i} className="flex"
                               style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <Legend
                                style={{minWidth: longestLabel + 1 + 'ch',}}
                            >
                                {field.label??field.name}
                            </Legend>
                            <div>
                                { options.map((option,j) =>{
                                  return (
                                      <Field className={'flex gap-1 items-center cursor-pointer'} key={j}>
                                          <Checkbox
                                              defaultChecked={option.defaultChecked??false}
                                              name={option.value??''}
                                              className="group block size-4 rounded border bg-white data-checked:bg-gray-900"
                                          >
                                              <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                                                  <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                          </Checkbox>
                                          <Label className={'cursor-pointer'}>{option.label}</Label>
                                      </Field>
                                  )
                                })
                                }
                            </div>
                        </Fieldset>
                    )
                }
                else if(field.type == 'radio'){
                    const options = field.options??[]
                    return (
                        <div key={i} className="flex"
                             style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <p style={{minWidth: longestLabel + 1 + 'ch',}}>{field.label??field.name}</p>
                            <RadioGroup
                                name={field.name}
                                defaultValue={options[field.defaultCheckedIndex??0]??'no-options-provided'}
                            >
                                {options.map((option,j) =>{
                                  return (
                                      <Field key={j} className="flex gap-1 items-center cursor-pointer">
                                          <Radio
                                              className={'flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-gray-900'}
                                              value={option.value}>
                                              <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                                          </Radio>
                                          <Label>{option.label??option.value}</Label>
                                      </Field>
                                  )
                                })
                                }
                            </RadioGroup>
                        </div>
                    )
                }
                else if(field.type === 'date'){
                    return (
                        <Field key={i} className="flex"
                               style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                            <Label
                                style={{minWidth: longestLabel + 1 + 'ch',}}
                            >
                                {field.label??field.name}
                            </Label>
                            {/*TODO: enable setting max and min/feedback */}
                            <Input
                                className={inputClassNameDefault}
                                name={field.name}
                                id={field.id}
                                defaultValue={field.defaultValue??undefined}
                                type="date"/>
                        </Field>
                    )
                }
                else if(field.type == 'tags'){
                    return (
                        <TagForm
                            key={i}
                            name={field.name}
                            possibleTagValues={field.tags??[]}
                            defaultValues={field.defaultTags}
                        />
                    )
                }
                else if(field.type == 'image'){
                    return (
                        <div key={i}>
                            <Field  className="flex"
                                    style={{flexDirection:field.labelPlacement??labelPlacementDefault??'column'}}>
                                <Label>{field.label??field.name}</Label>
                                <Input
                                    onChange={(event)=>{
                                        const files = event.target.files??[]
                                        if (files.length > 0){
                                            const file = files[0]
                                            const src = URL.createObjectURL(file)
                                            dispatch({selectedImageFile:src})
                                        }
                                    }}
                                    type={'file'} name={field.name} accept={'image/*'} className={'fileInputField'} />
                            </Field>
                            { (state.selectedImageFile as string)?.length > 0 &&
                                <div className={'max-w-40 w-fit my-6 border flex justify-center items-center'}>
                                    <img
                                        src={state.selectedImageFile as string}
                                        alt={'Image File Preview'}
                                        className={'object-contain'}
                                    />
                                </div>
                            }
                        </div>
                    )
                }
                else {
                            return(
                                <div key={i}>
                                    <p>name: {field.name}</p>
                                    <p>type: {field.type}</p>
                                </div>
                            )
                        }
                    }
                )
            }
            { altControls ?
                <>
                    {altControls}
                </> :
                <button type={'submit'} className={'w-fit'}>Submit</button>
            }
        </form>
    )
}

export default PushForm;