import {ReactNode} from "react";
import BurgerNav from "@/app/components/burgerNav";
import Link from "next/link";
import AdminBurger from "@/app/(private)/admin/components/adminBurger";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";
import {getSession} from "@/session/actions";
import PushLoginForm from "@/app/components/pushLoginForm";

export default async function RootLayout(
    {
        children,
    }: Readonly<{
        children: ReactNode;
        login: ReactNode;
        main: ReactNode;
    }>
) {
    const session = await getSession();
    return (
        <div className={'min-h-screen flex flex-col w-screen'}>
            <div>
                <BurgerNav>
                    <BurgerNav.Logo>
                        <div className={'flex gap-3 items-baseline'}>
                            <Link href={'/public'} className={'text-xl font-bold'}>Daily-Push!</Link>
                            <p>Articles</p>
                        </div>
                    </BurgerNav.Logo>
                    <BurgerNav.Burger>
                        <div className={'size-fit md:hidden block'}>
                            <AdminBurger />
                        </div>
                        <div className={'size-fit h-full items-center md:flex hidden'}>
                            <LogoutBtn />
                        </div>
                    </BurgerNav.Burger>
                </BurgerNav>
            </div>
            { session.isLoggedIn?
                children
                 :
                <div className="w-full h-full min-h-50 grow-1 flex flex-col items-center justify-center">
                    <PushLoginForm
                        style={'neon'}
                    />
                </div>
            }
        </div>
    )
}