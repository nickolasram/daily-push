'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import TipTapText from "@/app/components/tiptapText";
import {useState} from "react";

const pfNodes:pushFormNode[] = [
    {
        type: 'text',
        name: 'First Name',
        id: 'FirstName',
    },
    // {
    //     type: 'text',
    //     name: 'Last Name',
    //     id: 'FirstName',
    //     labelPlacement:'column'
    // },
    {
        type: 'number',
        name: 'owned',
        id: 'owned',
    },
    {
        type: 'number',
        label:'restricted:',
        name: 'owned2',
        id: 'owned2',
        min: -5,
        max: 5,
    },
    {
        type:'richTextField',
        name:'rtf',
        id: 'rtf'
    },
    {
        type:'custom',
        name:'customNode',
        id: 'customNode',
        node: <p>This is a custom piece</p>
    }
]

const Page=()=>{
    const [submittedEntries, setSubmittedEntries] = useState<[string, FormDataEntryValue][]|null>(null)
    return(
        <div>
            <h1>PushForm Demo</h1>
            <PushForm
                fields={pfNodes}
                labelPlacementDefault={'row'}
                onSubmit={(e)=>{
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const entries:[string,FormDataEntryValue][] =[...data.entries()]
                    const entriesNoHL:[string, FormDataEntryValue][] = entries.filter((entry)=>entry[0]!='highlightColor')
                    setSubmittedEntries(entriesNoHL);
                }}
            />
            { submittedEntries &&
                <>
                    { submittedEntries.map((entry,i)=>{
                                const entryName = entry[0];
                                const matchingNode = pfNodes.find(p => p.name === entryName);
                                if(matchingNode?.type==='richTextField'){
                                    return <div key={i}><TipTapText text={entry[1] as string}/></div>
                                } else {
                                    return <p key={i}>{entry[1] as string}</p>
                                }
                            }
                        )
                    }
                </>
            }
        </div>
    )
}

export default Page;