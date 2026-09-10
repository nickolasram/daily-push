import PushForm, {pushFormNode} from "@/app/components/PushForm";
import {RefObject, SubmitEvent} from "react";

export const ArticleControls = () => {
    return (
        <div className={'flex gap-2 flex-nowrap'}>
            <button type="submit" data-value={'save'} className={'w-fit'}>Save Draft</button>
            <button type="submit" data-value={"publish"} className={'w-fit px-[2ch]'}>Publish</button>
        </div>
    )
}

interface ArticleFormProps {
    fields: pushFormNode[],
    inputRoundedDefault?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    labelPlacementDefault?: 'column' | 'row',
    onSubmit: (event: SubmitEvent<HTMLFormElement>)=>void,
    rounded?: 'rounded-xs' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | string,
    ref?: RefObject<HTMLFormElement|null>,
}

export const ArticleForm = ({fields, onSubmit, labelPlacementDefault, rounded,inputRoundedDefault,ref}:ArticleFormProps) => {
    return (
        <PushForm
            fields={fields}
            onSubmit={onSubmit}
            altControls={ArticleControls()}
            labelPlacementDefault={labelPlacementDefault}
            ref={ref}
            rounded={rounded}
            inputRoundedDefault={inputRoundedDefault}
        />
    )
}