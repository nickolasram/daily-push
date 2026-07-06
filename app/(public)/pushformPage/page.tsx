'use client'

import PushForm, {pushFormNode} from "@/app/components/PushForm";

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
        name:'article',
        id: 'article',
        node: <p>This is a custom piece</p>
    }
]

const Page=()=>{
    return(
        <div>
            <h1>PushForm Demo</h1>
            <PushForm
                fields={pfNodes}
                labelPlacementDefault={'row'}
                onSubmit={(event)=>{event.preventDefault();alert("Pushform submitted")}} />
        </div>
    )
}

export default Page;