'use client'
import {useMediaQuery} from "@reactuses/core";
import {Tab, TabList} from "@headlessui/react";
import DraggableTabs from "@/app/components/frameworks/draggableTabs";
import {ReactNode} from "react";

interface ThinLeftTabsProps {
    tabs: string[],
    tabListAddendum?:ReactNode,
    icons?:ReactNode[],
}

export default function ThinLeftTabs({tabs,tabListAddendum,icons}:ThinLeftTabsProps) {
    const isWide = useMediaQuery("(min-width: 768px)", true);
    return (
        <>
            {isWide &&
                <div
                    className={'flex flex-col justify-between pt-4 border-r-2 border-gray-400 bg-gray-600 px-1'}
                >
                    <TabList
                        className={'flex flex-col'}
                    >
                        { tabs.map((tab,i)=>{
                            return (
                                <Tab
                                    key={i}
                                    className={' border-x-0 border-t-0 cursor-pointer text-gray-300 w-full text-left ' +
                                        'border-b-2 last-of-type:border-b-0 border-b-gray-400 py-2'}
                                >
                                    <p>{tab}</p>
                                </Tab>
                            )
                        })
                        }
                    </TabList>
                    { tabListAddendum }
                </div>
            }
            {!isWide &&
                <DraggableTabs labels={tabs} icons={icons} addendum={tabListAddendum} />
            }
        </>
    )
}