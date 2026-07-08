import ThinTabsFramework, {TTFChild} from "@/app/components/frameworks/thinTabsFramework";

const Addendum=()=>{
    return (
        <p className={'mb-15'}>Log Out</p>
    )
}

export default function Age(){
    return (
        <ThinTabsFramework tabs={['Projects','Tags']} tabListAddendum={<Addendum/>}>
            <TTFChild  className={'border-red-700 border-2 bg-cyan-800'}>
                <p>Project Tab</p>
            </TTFChild>
            <TTFChild className={'border-red-700 border-2 bg-cyan-800'}>
                <p>Tag Tab</p>
            </TTFChild>
        </ThinTabsFramework>
    )
}