const ArticleControls = ()=>{
    return(
        <div className={'flex gap-2 flex-nowrap'}>
            <button type="submit" data-value={'save'} className={'w-fit'}>Save Draft</button>
            <button type="submit" data-value={"publish"} className={'w-fit px-[2ch]'}>Publish</button>
        </div>
    )
}
export default ArticleControls;