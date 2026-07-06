"use client"
import {Lobster, Jost, Changa} from "next/font/google";
import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/tiptap-ui-primitive/tooltip'
import {useEditor, useEditorState, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from 'tiptap-extension-resize-image';
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BaseHeading from '@tiptap/extension-heading'
import {mergeAttributes} from '@tiptap/core'
import {TaskList} from '@tiptap/extension-task-list'
import {TaskItem} from '@tiptap/extension-task-item'
import {TextAlign} from '@tiptap/extension-text-align'
import Strike from '@tiptap/extension-strike'
// import { Image } from '@tiptap/extension-image'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'
import {FontSize, TextStyleKit, BackgroundColor} from '@tiptap/extension-text-style'
import Blockquote from '@tiptap/extension-blockquote'
import {Button} from '@/components/tiptap-ui-primitive/button'
import '@/components/card.css'
import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
} from "@headlessui/react";
import {ChangeEvent, useReducer, useEffect, useRef, useState, useCallback} from "react";
import HardBreak from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Emoji, {gitHubEmojis} from '@tiptap/extension-emoji'
import Typography from '@tiptap/extension-typography'
import {CharacterCount} from '@tiptap/extensions'
import EditorPopout from "@/app/components/textEditor/editorPopout";
import {MarkBar, StyleBar, InsertBar} from "@/app/components/textEditor/editorComponents";
import LargeEditor from "@/app/components/textEditor/largeEditor";

const lobster = Lobster({
    weight: '400',
    subsets: ['latin']
});

interface TipTapProps {
    editorContent: string,
    onChange: (description: string) => void,
    editorBG: string,
    defaultColor: string,
    ikey?: number|string
}


const TextEditor = ({editorContent, onChange, editorBG, defaultColor, ikey}: TipTapProps) => {
    const [state, dispatch] = useReducer(
        // TODO: TEST IF THIS TYPE WORKS
        (state: Record<string, unknown>, newState: Record<string, unknown>) => ({...state, ...newState}),
        {
            highlightColor: '#FFFF00',
            bgColor: editorBG,
            textColor: '#F88',
        }
    )
    const [TESet, setTESet] = useState(true);
    const [showPopout, setShowPopout] = useState(false)
    const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;
        dispatch({[name]: value});
    }
    const CustomLink = Link.extend({
        inclusive: false,
        renderHTML({HTMLAttributes}) {
            return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: ` underline `,
            }), 0]
        },
    })
    const editor = useEditor({
        extensions: [
            TaskList,
            Superscript,
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'blockquote',
                },
            }),
            Subscript,
            BackgroundColor,
            Highlight.configure({multicolor: true}),
            TaskItem.configure({nested: true}),
            Strike,
            StarterKit,
            CharacterCount,
            TextStyleKit,
            FontSize,
            ImageResize,
            Youtube,
            HardBreak,
            ListItem,
            Typography,
            Emoji.configure({
                emojis: gitHubEmojis,
            }),
            TextAlign.configure({types: ['paragraph']}),
            BaseHeading.extend({
                renderHTML({node, HTMLAttributes}) {
                    const level = this.options.levels.includes(node.attrs.level)
                        ? node.attrs.level
                        : this.options.levels[0];
                    const classes: { [index: number]: string } = {
                        1: 'capitalize font-bold text-center',
                        2: 'capitalize font-bold',
                        3: 'capitalize font-bold italic',
                        4: 'capitalize font-bold indent-4',
                        5: 'capitalize font-bold indent-4 italic',
                    };
                    return [
                        `h${level}`,
                        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                            class: `${classes[level]}`,
                        }),
                        0,
                    ]
                }
            }).configure({levels: [1, 2, 3, 4, 5]}),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc ml-2",
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "list-decimal ml-2",
                },
            }),
            CustomLink.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }
                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
            })
        ],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    `${defaultColor} ${editorBG} shadow border appearance-none min-h-[150px] border rounded-b-sm w-full max-w-max-w-[100%] py-2 px-3 text-sm leading-tight focus:outline-none focus:shadow-outline`,
            },
        },
        content: editorContent,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        },
    });
    useEffect(() => {
        if (editor && editorContent) {
            editor.commands.setContent(editorContent);
        }
    }, [editorContent]);

    const {charactersCount, wordsCount} = useEditorState({
        editor,
        selector: context => ({
            charactersCount: context?.editor?.storage.characterCount.characters(),
            wordsCount: context?.editor?.storage.characterCount.words(),
        }),
    }) ?? {charactersCount: 0, wordsCount: 0}
    if (!editor) {
        return null;
    }
    const resetTESet = () => {
        setTESet(false);
        setTimeout(() => {
            setTESet(true);
        }, 125)
    }
    const tabStyle = 'flex justify-center items-start opacity-70 data-[selected]:opacity-100 hover:opacity-100 data-[selected]:[borderInline:1px_solid_#bbb] data-[selected]:[borderBottom:0px] bg-gray-100 p-2'

    return (
        <>
            {TESet &&
                <div className="flex flex-col justify-stretch min-h-[200px] max-w-[100%]">
                    <TabGroup>
                        <TabList className={'flex justify-between'}>
                            <div
                                className={'flex items-end border-1 [borderTop:1px_solid_#bbb] [borderInline:1px_solid_#bbb]'}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Tab className={tabStyle}>
                                            <p className={'size-4 underline leading-4 text-gray-800'}><strong>B</strong>
                                            </p>
                                        </Tab>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div>
                                            <p>Mark</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Tab className={tabStyle}>
                                            <p className={`size-4 text-orange-900 leading-4 ${lobster.className}`}>H<sub>1</sub>
                                            </p>
                                        </Tab>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div>
                                            <p>Style</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Tab className={tabStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="2" stroke="#000" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 4.5v15m7.5-7.5h-15"/>
                                            </svg>
                                        </Tab>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div>
                                            <p>Insert</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex gap-2">
                                <div className={'flex items-center'}>
                                    <div className={'border rounded-sm text-sm px-1'}>
                                        <p>
                                            CC: {charactersCount}
                                        </p>
                                    </div>
                                </div>
                                <div className={'flex items-center'}>
                                    <div className={'border rounded-sm text-sm px-1'}>
                                        <p>
                                            WC: {wordsCount}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    data-style={'ghost'}
                                    onClick={() => setShowPopout(true)}
                                    tooltip={
                                        <div>
                                            <p>Break out large editor</p>
                                        </div>
                                    }
                                    aria-label="Break out large editor"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={'size-4'}
                                        fill="#000"
                                        viewBox="0 0 512 512">
                                        <g>
                                            <path className="st0" d="M96,0v416h416V0H96z M472,376H136V112h336V376z"/>
                                            <polygon className="st0"
                                                     points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                        </g>
                                    </svg>
                                </Button>
                            </div>
                        </TabList>
                        <div className={'border rounded-b border-b-0'}>
                            <TabPanels>
                                <TabPanel>
                                    <MarkBar editor={editor} color={state.highlightColor as string}
                                             handleColorChange={handleColorChange}/>
                                </TabPanel>
                                <TabPanel>
                                    <StyleBar editor={editor}/>
                                </TabPanel>
                                <TabPanel>
                                    <InsertBar editor={editor}/>
                                </TabPanel>
                            </TabPanels>
                            <div className={'max-h-100 overflow-y-scroll'}>
                                <EditorContent editor={editor}/>
                            </div>
                        </div>
                    </TabGroup>
                </div>
            }
            {
                showPopout &&
                <EditorPopout closeWindow={() => {
                    setShowPopout(false);
                    resetTESet();
                }}>
                    <LargeEditor editor={editor} color={state.highlightColor as string} handleColorChange={handleColorChange}/>
                </EditorPopout>
            }
        </>
    );
};
export default TextEditor;