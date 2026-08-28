"use client"

import {Button, Checkbox, Popover, PopoverButton, PopoverPanel, Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {Dispatch, SetStateAction, useState} from "react";
import {PushSortingFilterOption} from "@/types";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useMediaQuery} from "@reactuses/core";

interface Props {
    sortingOptions: PushSortingFilterOption[];
    style?: 'neon' | 'marble' | string;
    sortBy?: PushSortingFilterOption;
    setSortBy?:Dispatch<SetStateAction<PushSortingFilterOption>>;
    polarity?:number;
    setPolarity?:Dispatch<SetStateAction<1|-1>>;
    filterOptions?:string[];
    selectedFilterOptions?:string[];
    setSelectedFilterOptions?:Dispatch<SetStateAction<string[]>>;
    flexibleMonth?: boolean;
    startDate?:Date;
    setStartDate?:Dispatch<SetStateAction<Date>>;
    endDate?:Date;
    setEndDate?:Dispatch<SetStateAction<Date>>;
    setMonth?:Dispatch<SetStateAction<[number,number]>>;
    monthAndYear?:[number,number];
    minDate?:Date;
    maxDate?:Date;
    options: {
        sort?:0|1,
        order?:0|1,
        tags?:0|1,
        date?:0|1,
        search?:0|1,
        items?:0|1,
    }
}

const PushSortFilter=(
    {
        sortingOptions,
        style,
        sortBy,
        setSortBy,
        polarity,
        setPolarity,
        filterOptions,
        selectedFilterOptions,
        setSelectedFilterOptions,
        flexibleMonth,
        startDate=new Date(),
        endDate=new Date(),
        setStartDate,
        setEndDate,
        setMonth,
        monthAndYear,
        minDate,
        maxDate,
        options
    }:Props
)=>{
    const [expanded, setExpanded] = useState(false);
    const isWide = useMediaQuery("(min-width: 768px)", true);

    let startDisplayDate:Date;
    let endDisplayDate:Date;
    if (flexibleMonth) {
        startDisplayDate = new Date(startDate)
        endDisplayDate = new Date(endDate)
        startDisplayDate.setDate(startDisplayDate.getDate()-15);
        endDisplayDate.setDate(endDisplayDate.getDate()+15);
    } else {
        startDisplayDate = new Date(monthAndYear?monthAndYear[1]:2000,monthAndYear?monthAndYear[0]:0);
    }

    const barStyle=():string=>{
        if (style === 'neon'){
            if (!isWide&&!expanded){
                return 'bg-neon-cyan/75'
            }
            return 'bg-neon-cyan/75'
        }
        return '';
    }

    const btnStyle=():string=>{
        if (style === 'neon'){
            return 'bg-neon-cyan'
        }
        return '';
    }

    return(
        <div className={'w-full mb-6'}>
            <div className={'w-full flex justify-center max-w-[90svw]'}>
                <div className={`w-8/10 md:w-9/10 flex-wrap justify-start md:justify-center flex px-2 py-2 gap-2 md:gap-6 ${barStyle()}`}>
                    {(isWide || expanded) &&
                        <>
                            { options.sort && setSortBy && sortBy &&
                                <Listbox value={sortBy} onChange={setSortBy}>
                                    <ListboxButton
                                        className={`border border-white rounded-sm w-fit flex gap-2 ${btnStyle()}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path strokeWidth={1.5} d="M3 6.75h16.5M5 12h12.5M7 17.25h8.5" stroke={'currentColor'} strokeLinecap={'round'} />
                                        </svg>
                                        <p className={'max-w-14 capitalize min-w-14 w-14 truncate text-left'}>{sortBy.label}</p>
                                    </ListboxButton>
                                    <ListboxOptions anchor="bottom" className={'w-24 bg-neon-cyan px-1'}>
                                        {sortingOptions.map((option,i) => (
                                            <ListboxOption key={i} value={option} className="truncate cursor-pointer data-focus:brightness-75">
                                                {option.label}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            }
                            { options.order && polarity && setPolarity &&
                                <Button
                                    className={`border w-fit border-white rounded-sm flex gap-2 items-center px-1 ${btnStyle()}`}
                                    onClick={() => {
                                        // @ts-expect-error doesn't know this will just flip the polarity
                                        setPolarity(polarity*-1)}}
                                >
                                    { polarity == 1 &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                        </svg>
                                    }
                                    { polarity == -1 &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                        </svg>
                                    }
                                    <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>{polarity==1?'Desc':'Asc'}</p>
                                </Button>
                            }
                            { options.tags && selectedFilterOptions && setSelectedFilterOptions && filterOptions &&
                                <Listbox value={selectedFilterOptions} onChange={setSelectedFilterOptions} multiple={true}>
                                    <ListboxButton
                                        className={`border border-white rounded-sm flex gap-2 items-center px-1 ${btnStyle()}`}
                                    >
                                        <p className={'hidden md:inline max-w-14 min-w-14 w-14 truncate text-left'}>tags</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                        </svg>
                                    </ListboxButton>
                                    <ListboxOptions anchor="bottom" className={'w-min bg-neon-cyan px-1'}>
                                        {filterOptions.sort((a,b)=>a.localeCompare(b, undefined, {numeric:true})).map((option,i) => (
                                            <ListboxOption key={i} value={option} className="truncate cursor-pointer data-focus:brightness-75 flex gap-2">
                                                <Checkbox
                                                    checked={selectedFilterOptions.includes(option)}
                                                    className="group block size-4 rounded border bg-white data-checked:bg-blue-500 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:data-disabled:bg-gray-500"
                                                >
                                                    <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Checkbox>
                                                <p>
                                                    {option}
                                                </p>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>

                            }
                            { options.date &&
                                <Popover>
                                    <PopoverButton
                                        className={`border border-white rounded-sm flex gap-2 items-center px-1 ${btnStyle()}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        <p className={'max-w-14 min-w-14 w-14 truncate text-left'}>{startDisplayDate.toLocaleDateString("en-US", {month:"short",year:"2-digit"})}</p>
                                    </PopoverButton>
                                    <PopoverPanel
                                        className={'bg-white text-black fixed'}
                                        data-open={'close'}
                                    >
                                        {({ close }) =>(
                                            <Calendar
                                                minDate={minDate??new Date(1900,0)}
                                                maxDate={maxDate??new Date(2100,0)}
                                                defaultValue={new Date(monthAndYear?monthAndYear[1]:2000,monthAndYear?monthAndYear[0]:0)}
                                                maxDetail={'year'}
                                                view={'year'}
                                                onClickMonth={(value)=>{
                                                    if (setMonth && monthAndYear){
                                                        setMonth([value.getMonth()??0,value.getFullYear()??0])
                                                    }
                                                    close()
                                                }}
                                            />
                                        )
                                        }
                                    </PopoverPanel>
                                </Popover>
                            }
                            { options.search &&
                                <div
                                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                                >
                                    <p className={'hidden md:inline max-w-14 min-w-14 w-14 truncate text-left'}>search</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                            }
                            { options.items &&
                                <div
                                    className={'border border-white rounded-sm flex gap-2 items-center px-1'}
                                >
                                    <p className={'hidden md:inline max-w-14 min-w-14 w-14 truncate text-left'}>items</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                    </svg>
                                </div>
                            }
                        </>
                    }
                    {(!isWide && !expanded) &&
                        <Button onClick={()=>{setExpanded(true)}} className={'w-full border-none'}>Sort & Filter</Button>
                    }
                </div>
                <div className={`flex justify-start items-start w-1/10 md:hidden ${barStyle()}`}>
                    <Button
                        onClick={()=>{setExpanded(!expanded)}}
                        className={`border-none w-full flex justify-center items-center overflow-hidden h-full ${btnStyle()}`}
                    >
                        { expanded ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6`}>
                                <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6`}>
                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                            </svg>
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PushSortFilter;