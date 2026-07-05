import {Editor} from "@tiptap/react";
import {Button} from "@/components/tiptap-ui-primitive/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/tiptap-ui-primitive/tooltip";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/tiptap-ui-primitive/dropdown-menu";
import {TextAlignButton} from "@/components/tiptap-ui/text-align-button";
import {HeadingDropdownMenu} from "@/components/tiptap-ui/heading-dropdown-menu";
import {ListDropdownMenu} from "@/components/tiptap-ui/list-dropdown-menu";
import {BlockquoteButton} from "@/components/tiptap-ui/blockquote-button";
import {CodeBlockButton} from "@/components/tiptap-ui/code-block-button";

interface MarkBarProps {
    editor: Editor;
    color: string;
    handleColorChange: (e: ChangeEvent<HTMLInputElement>)=>void;
}

export const MarkBar=({editor, color, handleColorChange}:MarkBarProps)=> (
        <div className="flex items-center bg-gray-100">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded cursor-pointer ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
                        aria-label="Bold (Ctrl+B)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="black" className="size-4">
                            <path fillRule="evenodd"
                                  d="M4 3a1 1 0 0 1 1-1h6a4.5 4.5 0 0 1 3.274 7.587A4.75 4.75 0 0 1 11.25 18H5a1 1 0 0 1-1-1V3Zm2.5 5.5v-4H11a2 2 0 1 1 0 4H6.5Zm0 2.5v4.5h4.75a2.25 2.25 0 0 0 0-4.5H6.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className={'bg-white p-1'}>
                        <p>Bold</p>
                        <p>ctrl/cmd + B</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded cursor-pointer ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
                        aria-label={'italic button (ctrl/cmd+I)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="black" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className={'bg-white p-1'}>
                        <p>Italic</p>
                        <p>ctrl/cmd + I</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'is-active cursor-pointer' : 'cursor-pointer'}
                        aria-label={'underline button (ctrl/cmd+U)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="black" className="size-4">
                            <path fillRule="evenodd"
                                  d="M4.75 2a.75.75 0 0 1 .75.75V9a4.5 4.5 0 1 0 9 0V2.75a.75.75 0 0 1 1.5 0V9A6 6 0 0 1 4 9V2.75A.75.75 0 0 1 4.75 2ZM2 17.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className={'bg-white p-1'}>
                        <p>Underline</p>
                        <p>ctrl/cmd + U</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active cursor-pointer' : 'cursor-pointer'}
                        aria-label={'strikethrough button (ctrl/cmd+shift+S)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="black" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className={'bg-white p-1'}>
                        <p>Strikethrough</p>
                        <p>ctrl/cmd + shift + S</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={editor.isActive('superscript') ? 'is-active cursor-pointer' : 'cursor-pointer'}
                        aria-label={'Superscript button (ctrl/cmd+.)'}
                    >
                        <p className={'size-4 text-black'}>A<sup>a</sup></p>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Superscript</p>
                        <p>ctrl/cmd + .</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={editor.isActive('subscript') ? 'is-active cursor-pointer' : 'cursor-pointer'}
                        aria-label={'Subscript button (ctrl/cmd+,)'}
                    >
                        <p className={'size-4 text-black'}>A<sub>a</sub></p>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Subscript</p>
                        <p>ctrl/cmd + ,</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => {
                            editor.chain().focus().toggleHighlight({color: color}).run();
                        }}
                        className={editor.isActive('highlight') ? 'is-active cursor-pointer' : 'cursor-pointer'}
                        aria-label={'highlight button (ctrl/cmd+shift+H)'}
                    >
                        <p className={'size-4 text-black'}>
                            <mark>&nbsp;T&nbsp;</mark>
                        </p>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Highlight</p>
                        <p>ctrl/cmd + shift + H</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <input
                        type={'color'}
                        defaultValue={'#ffff00'}
                        className={'size-4 cursor-pointer'}
                        name={'highlightColor'}
                        aria-label={'highlight color picker'}
                        onChange={handleColorChange}/>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Highlight Color Picker</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )

interface StyleBarProps {
    editor: Editor;
}

function AlignmentDropDown({editor}: { editor:Editor }) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button type="button"  className={'tiptap-button'} data-style={'ghost'}>
                            <svg xmlns="http://www.w3.org/2000/svg" stroke={'#383838'} strokeWidth={1} viewBox="0 -1 24 24" className="size-5">
                                <path fillRule="evenodd"
                                      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                                      clipRule="evenodd"/>
                            </svg>

                            <svg width="24" height="24" className="tiptap-button-dropdown-small" viewBox="0 0 24 24"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="currentColor"></path>
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Alignment</p>
                        <p>Left: ctrl/cmd + shift + L</p>
                        <p>Center: ctrl/cmd + shift + E</p>
                        <p>Justified: ctrl/cmd + shift + J</p>
                        <p>Right: ctrl/cmd + shift + R</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className={'tiptap-card'}>
                <DropdownMenuGroup className={'tiptap-card-body'}>
                    <DropdownMenuItem asChild>
                        <TextAlignButton
                            editor={editor}
                            align="left"
                            text="Left"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                            className={'tiptap-button w-full'}
                            tooltip={undefined}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <TextAlignButton
                            editor={editor}
                            align="center"
                            text="Center"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                            className={'tiptap-button w-full'}
                            tooltip={undefined}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <TextAlignButton
                            editor={editor}
                            align="justify"
                            text="Justify"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                            className={'tiptap-button w-full'}
                            tooltip={undefined}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <TextAlignButton
                            editor={editor}
                            align="right"
                            text="Right"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                            className={'tiptap-button w-full'}
                            tooltip={undefined}
                        />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const fonts = [
    'American Typewriter, serif',
    'Andale Mono, monospace',
    'Apple Chancery, cursive',
    'Arial, sans-serif',
    'Arial Narrow, sans-serif',
    'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
    'Blippo, fantasy',
    'Bradley Hand, cursive',
    'Bookman, URW Bookman L, serif',
    'Brush Script MT, Brush Script Std, cursive',
    'Chalkduster, fantasy',
    'Comic Sans MS, Comic Sans, cursive',
    'Courier, monospace',
    'Courier New, monospace',
    'DejaVu Sans Mono, monospace',
    'Didot, serif',
    'FreeMono, monospace',
    'Georgia, serif',
    'Gill Sans, sans-serif',
    'Helvetica, sans-serif',
    'Impact, fantasy',
    'Inter, sans-serif',
    'Jazz LET, fantasy',
    'Jost, sans-serif',
    'Lobster, sans-serif',
    'Luminari, fantasy',
    'Marker Felt, fantasy',
    'New Century Schoolbook, TeX Gyre Schola, serif',
    'Noto Sans, sans-serif',
    'OCR A Std, monospace',
    'Optima, sans-serif',
    'Palatino, URW Palladio L, serif',
    'Snell Roundhand, cursive',
    'Stencil Std, fantasy',
    'Times, Times New Roman, serif',
    'Trattatello, fantasy',
    'Trebuchet MS, sans-serif',
    'Verdana, sans-serif',
    'URW Chancery L, cursive',
]

function FontFamilyDropDown({editor}: { editor:Editor }) {
    const labelRef = useRef<null|HTMLParagraphElement>(null);
    const [fontLabel, setFontLabel] = useState('a')
    useEffect(() => {
        if(labelRef.current){
            const font = getComputedStyle(labelRef.current).fontFamily;
            setFontLabel(font.split(',')[0]);
            labelRef.current.style.fontFamily = font;
        }
    }, []);
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" className={'tiptap-button border bg-white'} data-style={'ghost'}>
                            <p className={'text-black w-16 text-start text-nowrap truncate py-1 max-w-16 bg-white px-1'} ref={labelRef}>{fontLabel}</p>
                            <svg width="24" height="24" className="tiptap-button-dropdown-small" viewBox="0 0 24 24"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="currentColor"></path>
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Font Family</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className={'tiptap-card'}>
                <DropdownMenuGroup className={'tiptap-card-body'}>
                    <DropdownMenuItem>
                        {fonts.map((ff, i)=>{
                            return (
                                <Button
                                    key={i}
                                    type="button"
                                    data-style={'ghost'}
                                    onClick={() => {
                                        editor.chain().focus().setFontFamily(ff).run()
                                        setFontLabel(ff.split(',')[0]);
                                        labelRef.current!.style.fontFamily = ff;
                                    }}
                                    className={`p-2 rounded ${editor.isActive('textStyle', { fontFamily: ff }) ? "bg-gray-200" : ""}`}
                                    aria-label={"Font Family: " + ff}
                                >
                                    <p
                                        style={{
                                            fontFamily: ff,
                                            color: 'black',
                                        }}
                                    >{ff.split(',')[0]}</p>
                                </Button>
                            )
                        })}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

const lineHeights = ['1','1.15','1.5','2','2.5','3']

function LineHeightDropDown({editor}: { editor:Editor }) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button type="button"  className={'tiptap-button border bg-white'} data-style={'ghost'}>
                            <svg className={'size-4'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10V5M6 5L4 7M6 5L8 7M6 14V19M6 19L8 17M6 19L4 17M12 7H20M20 12H12M12 17H20"
                                      stroke="#000000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"/>
                            </svg>
                            <svg width="24" height="24" className="tiptap-button-dropdown-small" viewBox="0 0 24 24"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="currentColor"></path>
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Line Height</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className={'tiptap-card'}>
                <DropdownMenuGroup className={'tiptap-card-body'}>
                    <DropdownMenuItem>
                        {lineHeights.map((lh, i)=>{
                            return (
                                <Button
                                    key={i}
                                    type="button"
                                    data-style={'ghost'}
                                    onClick={() => editor.chain().focus().toggleTextStyle({ lineHeight: lh }).run()}
                                    aria-label={"Line height: " + lh}
                                >
                                    <p className={'text-black'}>{lh}</p>
                                </Button>
                            )
                        })}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const StyleBar=({editor}:StyleBarProps)=>(
    <div className="flex items-center gap-2 bg-gray-100">
        <HeadingDropdownMenu
            editor={editor}
            levels={[1, 2, 3, 4, 5]}
            hideWhenUnavailable={true}
            portal={false}
            title={'ctrl/cmd+alt+1\nctrl/cmd+alt+2\nctrl/cmd+alt+3\nctrl/cmd+alt+4\nctrl/cmd+alt+5'}
        />
        <FontFamilyDropDown editor={editor} />
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={'h-6'}>
                    <input type={'number'} min={'1'} max={'128'} defaultValue={'12'}
                           className={'w-12 text-sm h-6'}
                           aria-label={'font size input'} onChange={e=>editor.chain().focus().setFontSize(e.target.value+'px').run()}
                    />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div>
                    <p>Font Size</p>
                </div>
            </TooltipContent>
        </Tooltip>
        <LineHeightDropDown editor={editor} />
        <AlignmentDropDown editor={editor} />
    </div>
)

interface InsertBarProps {
    editor: Editor
}

export const InsertBar = ({editor}:InsertBarProps) => {
    const setLink = useCallback(() => {
        if(editor){
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)
            let displayText = window.prompt('Display Text')

            // cancelled
            if (url === null) {
                return
            }

            if (displayText === null || displayText === '') {
                displayText = url
            }

            // empty
            if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                return
            }

            // update link
            try {
                editor.commands.insertContent(`<a target="_blank" href="${url}">${displayText}</a>`)
            } catch (err) {
                // @ts-expect-error err is of type unknown
                alert(err.message)
            }
        }
    }, [editor])
    const addImage = useCallback(() => {
        if (editor) {
            const url = window.prompt('Image URL')

            if (url) {
                editor.chain().focus().setImage({ src: url }).run()
            }
        }
    }, [editor])
    const addYoutubeVideo = () => {
        if (editor){
            const url = prompt('Enter YouTube URL')
            if (url) {
                editor.commands.setYoutubeVideo({
                    src: url,
                    width: 320,
                    height: 240,
                })
            }
        }
    }
    return (
        <div className="flex items-center bg-gray-100">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={() => editor.chain().focus().setHardBreak().run()}
                        aria-label={'Add line break (shift + enter or ctrl/cmd + enter)'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke={'black'}
                            fill="none"
                        >
                            <path
                                strokeLinecap={'round'}
                                strokeLinejoin={'round'}
                                d={'M22 8 v6h-20l4 -4M2 14l4 4'}
                            />
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Insert line break</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <ListDropdownMenu
                        editor={editor}
                        types={['bulletList', 'orderedList', 'taskList']}
                        hideWhenUnavailable={true}
                        portal={false}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>List</p>
                        <p>Bullet: Cmd/Ctrl + Shift + 8</p>
                        <p>Ordered: Cmd/Ctrl + Shift + 7</p>
                        <p>Task: Cmd/Ctrl + Shift + 9</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <BlockquoteButton
                        editor={editor}
                        hideWhenUnavailable={true}
                        showShortcut={false}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Block quote</p>
                        <p>ctrl/cmd + B</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={setLink}
                        aria-label={'Add link'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="black" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Add Link</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <CodeBlockButton
                        editor={editor}
                        hideWhenUnavailable={true}
                        showShortcut={false}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Code block</p>
                        <p>ctrl/cmd + alt + C</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={addImage}
                        aria-label={'Insert image'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"
                             className="size-4">
                            <path fillRule="evenodd"
                                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Insert image</p>
                    </div>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        data-style={'ghost'}
                        onClick={addYoutubeVideo}
                        aria-label={'Insert Youtube video'}
                    >
                        <svg fill="#000000" className={'size-4'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 310 310">
                            <g id="XMLID_822_">
                                <path id="XMLID_823_" d="M297.917,64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359,0-61.369,5.776-72.517,19.938
                                                C0,79.663,0,100.008,0,128.166v53.669c0,54.551,12.896,82.248,83.386,82.248h143.226c34.216,0,53.176-4.788,65.442-16.527
                                                C304.633,235.518,310,215.863,310,181.835v-53.669C310,98.471,309.159,78.006,297.917,64.645z M199.021,162.41l-65.038,33.991
                                                c-1.454,0.76-3.044,1.137-4.632,1.137c-1.798,0-3.592-0.484-5.181-1.446c-2.992-1.813-4.819-5.056-4.819-8.554v-67.764
                                                c0-3.492,1.822-6.732,4.808-8.546c2.987-1.814,6.702-1.938,9.801-0.328l65.038,33.772c3.309,1.718,5.387,5.134,5.392,8.861
                                                C204.394,157.263,202.325,160.684,199.021,162.41z"/>
                            </g>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p>Insert Youtube video</p>
                    </div>
                </TooltipContent>
            </Tooltip>


        </div>
    )
}