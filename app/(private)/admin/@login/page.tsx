import PushLoginForm from "@/app/components/pushLoginForm";
const Page=()=>{
    return(
        <div className="w-full h-full min-h-50 grow-1 flex flex-col items-center justify-center">
            {/*<LoginForm />*/}
            <PushLoginForm
                style={'neon'}
            />
        </div>
    )
}

export default Page;