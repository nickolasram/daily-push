import {ReactNode} from "react";
import BurgerNav from "@/app/components/burgerNav";
import Link from "next/link";
import AdminBurger from "@/app/(private)/admin/components/adminBurger";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";

export default async function RootLayout(
    {
        children,
    }: Readonly<{
        children: ReactNode;
        login: ReactNode;
        main: ReactNode;
    }>
) {
    return (
        <div className={'min-h-screen flex flex-col'}>
            <div>
                <BurgerNav>
                    <BurgerNav.Logo>
                        <div className={'flex gap-3 items-baseline'}>
                            <Link href={'/'} className={'text-xl font-bold'}>Daily-Push!</Link>
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
            {children}
        </div>
    )
}