"use client"
import {useDraggable, useWindowSize, useElementSize} from "@reactuses/core";
import {ReactNode, useRef} from "react";
import {TabList, Tab, Popover, PopoverButton, PopoverPanel} from "@headlessui/react";

interface DraggableTabsProps{
    labels?:string[];
    icons?:ReactNode[];
    addendum?:ReactNode;
}

const DraggableTabs=({icons,labels,addendum}:DraggableTabsProps)=>{
    const draggableRef = useRef<HTMLDivElement>(null);
    const {width,height} = useWindowSize();
    const [elementWidth, elementHeight] = useElementSize(draggableRef);
    const padding = 10;
    const [x,y,isDragging,setPosition] = useDraggable(draggableRef,
        {
            initialValue:{x: 0, y: height/2-elementHeight/2},
            preventDefault:true,
            exact:true,
            onEnd:()=>{
                setPosition(
                    {
                        x:x/width > 0.5?width-elementWidth:-1,
                        y:Math.min(Math.max(0,y), height-elementHeight-50),
                    }
                )
            },
        },
    );
    return (
        <div
            ref={draggableRef}
            style={{
                position: "fixed",
                cursor: "move",
                zIndex: 10,
                touchAction: "none",
                border: "solid 2px #99a1af",
                left: x,
                top: y,
                width: 44,
                overflow: "hidden",
                display: "flex",
                flexDirection:"column",
                alignItems:"center",
                pointerEvents:'all'
            }}
            className={'bg-gray-600'}
        >
            <Popover>
                <TabList>
                    <PopoverPanel
                        anchor={{ to: 'top start', gap: '13px', offset: -4 }}
                        as={'div'}
                        className={`flex-col transition-all duration-500 items-left border-2 flex border-gray-400 bg-gray-600`}>
                        { !icons && labels &&
                            <>
                                { labels.map((label,i)=>{
                                    return (<Tab key={i} className={'overflow-hidden text-nowrap border-0'}>{label}</Tab>)
                                })
                                }
                            </>
                        }
                        {
                            icons &&
                            <>
                                { icons.map((icon,i)=>{
                                    return(
                                        <Tab key={i}>
                                            {icon}
                                        </Tab>
                                    )
                                })
                                }
                            </>
                        }
                        {addendum}
                    </PopoverPanel>
                </TabList>
                <div
                    style={{paddingInline:padding}}
                    className={'cursor-pointer pb-2 pt-3 border-b-2 border-gray-400'}>
                    <PopoverButton as={'button'} className={'border-0'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </PopoverButton>
                </div>
            </Popover>
            <svg
                style={{paddingInline:padding}}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="currentColor"
                className="pointer-events-none h-6 my-3"
            >
                <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            {isDragging &&
                <div
                    style={{
                        position: "fixed",
                        zIndex:9,
                        border: "dashed 1px",
                        height: elementHeight,
                        width: elementWidth,
                        top: y,
                        right: x/width <= 0.5?width-elementWidth:0,
                    }}
                >
                </div>
            }
        </div>
    )
}

export default DraggableTabs