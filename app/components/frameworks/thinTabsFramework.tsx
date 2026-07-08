import {TabGroup, TabPanel, TabPanels} from '@headlessui/react'
import {ReactNode} from "react";
import ThinLeftTabs from "@/app/components/frameworks/thinLeftTabs";

interface ThinTabsFrameworkProps {
    tabs: string[],
    children: ReactNode,
    tabListAddendum?:ReactNode
}

interface TTFChildProps {
    children: ReactNode,
    className?: string
}

export function TTFChild({children, className}:TTFChildProps){
    return (
        <TabPanel as={'div'} className={className??''}>
            {children}
        </TabPanel>
    )
}

const ThinTabsFramework=({tabs,children,tabListAddendum}:ThinTabsFrameworkProps)=>{
    return (
        <TabGroup as={'div'} className={'min-h-50 grow-1 w-screen flex'}>
            <ThinLeftTabs tabs={tabs} tabListAddendum={tabListAddendum} />
            <TabPanels>
                {children}
            </TabPanels>
        </TabGroup>
    )
}

export default ThinTabsFramework;