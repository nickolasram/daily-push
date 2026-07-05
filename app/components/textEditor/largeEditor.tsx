import {InsertBar, MarkBar, StyleBar} from "@/app/components/textEditor/editorComponents";
import {Editor, EditorContent} from "@tiptap/react";
import {ChangeEvent} from "react";

interface LargeEditorProps {
    editor: Editor;
    color: string;
    handleColorChange: (e: ChangeEvent<HTMLInputElement>)=>void;

}

const LargeEditor=({editor, color, handleColorChange}:LargeEditorProps)=>{
    return (
        <div className="flex flex-col justify-stretch min-h-[200px] max-w-[100%]">
                <div className={'border rounded-b border-b-0'}>
                    <MarkBar editor={editor} color={color} handleColorChange={handleColorChange} />
                    <StyleBar editor={editor} />
                    <InsertBar editor={editor} />
                    <EditorContent editor={editor}/>
                </div>
        </div>
    )
}

export default LargeEditor