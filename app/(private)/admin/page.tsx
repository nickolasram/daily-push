"use server"
import LoginForm from "./components/loginForm";

const Page =async()=>{
    return(
        <div>
            <p>This is the admin page</p>
            <LoginForm />
        </div>
    )
}

export default Page;