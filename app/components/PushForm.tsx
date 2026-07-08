'use client'
import {Fragment, ReactNode, RefObject, SubmitEvent, useReducer, useRef, useState} from "react";
import {Field, Input, Label, Textarea, Checkbox, Legend, Fieldset, Radio, RadioGroup, Button} from '@headlessui/react'
import TextEditor from "@/app/components/textEditor/TextEditor";

interface keyValueBlockProps {
    name: string
}

export function generateKVRecord(name:string, formData:FormData) {
    const returnedRecord:Record<string,string> = {}
    const recordKeys = formData.getAll(name+'Key') as [string];
    const recordValues = formData.getAll(name+'Value') as [string];
    const listLength = recordKeys.length;
    for(let i=0;i<listLength;i++){
        returnedRecord[recordKeys[i]] = recordValues[i];
    }
    return returnedRecord;
}

const KeyValueBlock=({name}:keyValueBlockProps)=>{
    const [keyValue, setKeyValue] = useState<string>("[empty]")
    const [valueValue, setValueValue] = useState<string>("[empty]")
    // TODO: Make more flexible width
    return(
        <div className={'flex flex-col border-black border-b-1'}>
            <input className={'hidden size-0'} type={'checkbox'} name={name+'Key'} value={keyValue} defaultChecked={true} readOnly={true} />
            <input placeholder={'key'} className={'border-black w-60 border-b-1'} type={'text'} onChange={(e)=>setKeyValue(e.target.value)} />
            <input className={'hidden size-0'} type={'checkbox'} name={name+'Value'} value={valueValue} defaultChecked={true} readOnly={true} />
            <input placeholder={'value'} className={'w-60 backdrop-brightness-95'} type={'text'} onChange={(e)=>setValueValue(e.target.value)} />
        </div>
    )
}

interface keyValueFieldProps {
    name: string,
    rounded:'rounded-xs'|'rounded-sm'|'rounded-md'|'rounded-lg'|'rounded-xl'|string,
}

const KeyValueField=({name,rounded}:keyValueFieldProps)=>{
    const [blockCount,setBlockCount]=useState(1)
    return (
        <div className={`flex flex-col border ${rounded}`}>
            {[...Array(blockCount)].map((_,i)=>{
                return(
                    <KeyValueBlock name={name} key={i} />
                )
            })
            }
            {/*TODO:replace with headless ui button*/}
            <button
                type='button'
                onClick={()=>setBlockCount(blockCount+1)}
                className={'border-none flex gap-2 items-center'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>
                <p className={'text-sm text-gray-900'}>Add Key,Value</p>
            </button>
        </div>
    )
}

interface TagFormProps{
    name:string,
    possibleTagValues:string[],
}

const TagForm = ({name,possibleTagValues}:TagFormProps)=>{
    const [matchingValues,setMatchingValues]=useState<string[]>([])
    const [verifiedTags,setVerifiedTags]=useState<string[]>([])
    const inputRef = useRef<HTMLInputElement|null>(null)

    const handleChange=(input:string)=>{
        if(input?.length==0){
            setMatchingValues([])
        } else {
            const regexValue = input + '.*'
            const re = new RegExp(regexValue, 'i')
            setMatchingValues(possibleTagValues.filter(word=>re.test(word)))
        }
    }

    const AcceptedTag=({value}:{value:string})=>{
        return (
            <>
                <input name={name} value={value} readOnly={true} className={'hidden size-0'} />
                <Button
                    type="button"
                    className={'bg-cyan-800 border-3 grow-0 w-min h-min px-1 flex gap-1 items-center rounded-lg'}
                    onClick={()=>{setVerifiedTags(verifiedTags.filter(tag=>tag!==value))}}
                >
                    <p>{value}</p>
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
                <div className={'border border-white flex flex-col bg-gray-700 border-t-0 w-50'}>
                    { matchingValues.map((v,i)=>{
                        return (
                            <Button
                                key={i}
                                className={'text-left cursor-pointer'}
                                onClick={()=> {
                                    inputRef.current!.value=''
                                    setMatchingValues([])
                                    setVerifiedTags([...verifiedTags, v])
                                }}
                            >
                                {v}
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
    id: string,
    inputRounded?: 'rounded-none' | 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    label?: string,
    labelPlacement?: 'column' | 'row',
    max?: number,
    min?: number,
    name: string,
    node?: ReactNode,
    options?:Array<{ value:string, label:string, defaultChecked?:boolean }>,
    tags?: string[],
    type: 'text' | 'number' | 'textArea' | 'richTextField' | 'file' | 'image' | 'date' | 'custom' | 'keyValueField' | 'radio' | 'check' | 'tags',
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
}

const PushForm = ({fields, onSubmit, labelPlacementDefault, rounded,inputRoundedDefault,ref}:pushFormProps)=>{
    // TODO: Right now, can only save the value of one right text field
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
        }
    );
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
                                    type="text"/>
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
                                    editorContent={state.defaultDescription as string}
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
                            <KeyValueField name={field.name} rounded={field.inputRounded??inputRoundedDefault??'rounded-xs'} />
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
                                type="date"/>
                        </Field>
                    )
                }
                else if(field.type == 'tags'){
                    return (
                        <TagForm key={i} name={field.name} possibleTagValues={field.tags??[]} />
                    )
                }
                else {
                            return(
                                <div key={i}>
                                    <p>name: {field.name}</p>
                                    <p>type: {field.type}</p>
                                    <p>id: {field.id}</p>
                                </div>
                            )
                        }
                    }
                )
            }
            <button type={'submit'} className={'w-fit'}>Submit</button>
        </form>
    )
}

export default PushForm;