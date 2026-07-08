'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";
import TipTapText from "@/app/components/tiptapText";
import {useState} from "react";
import {generateKVRecord} from "@/app/components/PushForm";

const pfNodes:pushFormNode[] = [
    {
        type: 'text',
        name: 'First Name',
        id: 'FirstName',
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
        type: 'date',
        label:'release:',
        name: 'releaseDate',
        id: 'releaseDate',
    },
    {
        type: 'keyValueField',
        name: 'kvf',
        id: 'kvf',
        label:'credits'
    },
    {
        type:'textArea',
        name:'givenTA',
        id: 'givenTA',
    },
    {
        type:'richTextField',
        name:'rtf',
        id: 'rtf',
        label: 'Description'
    },
    {
      type: 'check',
      name:'awards',
      id: 'awards',
      label:'Awards Won',
      options: [
          {
              value:'awards-direction',
              label: 'Direction'
          },
          {
              value:'awards-picture',
              label: 'Best Picture'
          },
          {
              value:'awards-score',
              label: 'Score'
          },
      ]
    },
    {
        type: 'radio',
        name:'score',
        id: 'score',
        label:'Score',
        defaultCheckedIndex:2,
        options: [
            {
                value:'1',
                label: '1-Star'
            },
            {
                value:'2',
                label: '2-Star'
            },
            {
                value:'3',
                label: '3-Star'
            },
            {
                value:'4',
                label: '4-Star'
            },
            {
                value:'5',
                label: '5-Star'
            },
        ]
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
                    const kvRecord = generateKVRecord('kvf', data);
                    const kvList:[string,string][]=[];
                    for(const k in kvRecord){
                        kvList.push([k,kvRecord[k]]);
                    }
                    const entries:[string,FormDataEntryValue][] =[...data.entries()]
                    const entriesNoHL:[string, FormDataEntryValue][] = entries.filter(
                        (entry)=>(
                            entry[0]!='highlightColor'&&entry[0]!='kvfKey'&&entry[0]!='kvfValue'
                        )
                    )
                    entriesNoHL.push(['kvf',kvList as unknown as FormDataEntryValue])
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
                                } else if(matchingNode?.type==='keyValueField'){
                                    return (
                                        <div key={i}>
                                            <p>Credits from KeyValueField</p>
                                            {(entry[1] as unknown as [string,string][]).map((entry:[string,string],j:number)=>{
                                              return <div key={j} className={'flex gap-5'}><p>{entry[0]}</p><p>{entry[1]}</p></div>
                                            })
                                            }
                                        </div>
                                    )
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