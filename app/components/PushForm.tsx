'use client'
import {Fragment, ReactNode, RefObject, SubmitEvent, useEffect, useReducer, useRef, useState} from "react";
import {
    Field,
    Input,
    Label,
    Textarea,
    Checkbox,
    Legend,
    Fieldset,
    Radio,
    RadioGroup,
    Button,
    Popover, PopoverButton, PopoverPanel
} from '@headlessui/react'
import TextEditor from "@/app/components/textEditor/TextEditor";
import {KVRecord, providedKVFieldValues} from "@/types";

interface keyValueBlockProps {
    name: string,
    providedKV:KVRecord,
    suggestedKVs?:(string|{value:string,display:string})[],
    reference?:{value:string,display:string}[],
    deleteRecord:(record:KVRecord) => void,
    indexInKVArray:number,
    updateArray:(index:number,object:KVRecord)=>void
}

export function generateKVRecord(name:string, formData:FormData) {
    const returnedRecords: KVRecord[] = []
    const recordKeys = formData.getAll(name+'Key') as [string];
    const recordValues = formData.getAll(name+'Value') as [string];
    const recordObject = formData.getAll(name+'Object') as [string];
    const recordHidden = formData.getAll(name+'Hidden') as [string];
    const listLength = recordKeys.length;
    for(let i=0;i<listLength;i++){
        returnedRecords.push(
            {
                key:recordKeys[i],
                value:recordValues[i],
                object:recordObject.includes(recordValues[i]+'Object'),
                hidden: recordHidden.includes(recordValues[i]+'Hidden')
            }
        )
    }
    return returnedRecords;
}

const KeyValueBlock=({name,indexInKVArray,updateArray,providedKV,suggestedKVs,reference,deleteRecord}:keyValueBlockProps)=>{
    const getDisplayName=()=>{
        if(providedKV.object){
            const filteredSuggestions=suggestedKVs?.filter(obj=>{return typeof obj != 'string'})
            const referencedObject = [...reference??[],...filteredSuggestions??[]]?.find(obj=> {
                return obj.value == providedKV.value
            })
            if(referencedObject){
                return referencedObject.display
            } else {
                return '[User not found]'
            }
        } else {
            return providedKV.value
        }
    }
    const [matchingValues,setMatchingValues]=useState<(string|{display:string,value:string})[]>([])
    const [hoveringSuggestions,setHoveringSuggestions]=useState<boolean>(false)
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
        <div className={'flex flex-col items-stretch border-black border-b-1 relative'}
             onBlur={()=>{
                 if (!hoveringSuggestions) {
                     setMatchingValues([])
                 }
             }}
        >
            <div className={'w-60 flex'}>
                <div className={'w-fit flex flex-col grow-0 border-r-1 border-black'}>
                    <input className={'hidden size-0'} type={'checkbox'} name={name+'Key'} value={providedKV.key} defaultChecked={true} readOnly={true} />
                    <input placeholder={'key'} value={providedKV.key} className={'border-black w-45 border-b-1'} type={'text'}
                           onChange={(e)=> {
                               const newValue = {...providedKV,key:e.target.value}
                               updateArray(indexInKVArray,newValue)
                           }}
                    />
                    <input className={'hidden size-0'} type={'checkbox'} name={name+'Value'} value={providedKV.value} defaultChecked={true} readOnly={true} />
                    <input placeholder={'value'} className={'w-45 backdrop-brightness-95'} type={'text'} value={getDisplayName()}
                           onChange={(e)=> {
                               if (suggestedKVs) {
                                   handleChange(e.target.value)
                               }
                               const newValue = {...providedKV,value:e.target.value}
                               updateArray(indexInKVArray,newValue)
                            }
                           }
                           onFocus={()=>{
                               if (providedKV.value.length > 0) {
                                   handleChange(providedKV.value)
                               }
                           }}
                    />
                    <input className={'hidden size-0'} type={'checkbox'} name={name+'Object'} value={providedKV.value+'Object'} checked={providedKV.object} readOnly={true} />
                    <input className={'hidden size-0'} type={'checkbox'} name={name+'Hidden'} value={providedKV.value+'Hidden'} checked={providedKV.hidden} readOnly={true} />
                </div>
                <div className={'grow flex items-center justify-around'}>
                    <Button
                        className={'border-none'}
                        onClick={() => {
                            updateArray(indexInKVArray,{...providedKV, hidden: !providedKV.hidden})
                        }
                    }
                    >
                        { !providedKV.hidden ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                            </svg>:
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                            </svg>
                        }
                    </Button>
                    <Popover className={'size-6'} as={'div'}>
                        <PopoverButton className={'p-0 border-none'}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                        </PopoverButton>
                        <PopoverPanel className={'border fixed bg-red-900 rounded-sm'} anchor={'bottom'}>
                            {({ close }) =>(
                                <Button
                                    onClick={()=> {
                                        deleteRecord(providedKV)
                                        close()
                                    }}
                                >
                                    Delete ?
                                </Button>
                            )}
                        </PopoverPanel>
                    </Popover>

                </div>
            </div>
            { matchingValues?.length > 0 &&
                <div className={'z-10 absolute top-[100%] w-full border-black border-2 left-3  bg-white'}
                    onMouseOver={()=>{setHoveringSuggestions(true)}}
                     onMouseLeave={()=>{setHoveringSuggestions(false)}}
                >
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
                                        updateArray(indexInKVArray,{...providedKV,value:v,object:false})
                                        setHoveringSuggestions(false)
                                        setMatchingValues([])
                                    } else {
                                        updateArray(indexInKVArray,{...providedKV,value:v.value,object:true})
                                        setHoveringSuggestions(false)
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
    providedKVs?:providedKVFieldValues,
    suggestedKVs?:(string|{value:string,display:string})[],
}

const KeyValueField=({name,rounded,providedKVs,suggestedKVs}:keyValueFieldProps)=>{
    const [KVRecords,setKVRecords]=useState<KVRecord[]>(!providedKVs||providedKVs.defaultRecords.length==1?[{value:'',key:'',hidden:true,object:false}]:providedKVs.defaultRecords)
    const deleteKVRecord=(record:KVRecord)=>{
        const filtered = KVRecords.filter(obj=> {
            return obj != record
        })
        setKVRecords([...filtered])
    }
    const updateArray=(index:number,object:KVRecord)=>{
        setKVRecords(KVRecords.toSpliced(index,1,object))
    }
    return (
        <div className={`flex flex-col border w-fit ${rounded}`}>
            {KVRecords.map((_,i)=>{
                return(
                    <KeyValueBlock
                        deleteRecord={deleteKVRecord}
                        name={name}
                        key={i}
                        providedKV={_}
                        suggestedKVs={suggestedKVs}
                        reference={providedKVs?.reference}
                        indexInKVArray={i}
                        updateArray={updateArray}
                    />
                )
            })}
            <Button
                type='button'
                onClick={()=>setKVRecords([...KVRecords,{value:'',key:'',hidden:true,object:false}])}
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
    providedKVs?:providedKVFieldValues,
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
                                providedKVs={field.providedKVs}
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