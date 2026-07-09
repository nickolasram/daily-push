import {getSession} from "@/session/actions";
import {ReactNode} from "react";

export default async function RootLayout(
    {
        children,
        login,
        main
    }: Readonly<{
        children: ReactNode;
        login: ReactNode;
        main: ReactNode;
    }>
) {
    const session = await getSession();
    return (
        <div className={'min-h-screen flex flex-col'}>
            {children}
            { session.isLoggedIn ? main : login }
        </div>
    )
}