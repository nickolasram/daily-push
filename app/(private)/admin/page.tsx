"use server"
import BurgerNav from "@/app/components/burgerNav";
import Link from "next/link";
import AdminBurger from "@/app/(private)/admin/components/adminBurger";
import LogoutBtn from "@/app/(private)/admin/components/logoutBtn";

const Page =async()=>{
    return(
        <div>
            <BurgerNav>
                <BurgerNav.Logo>
                    <div className={'flex gap-3 items-baseline'}>
                        <Link href={'/'} className={'text-xl font-bold'}>Daily-Push!</Link>
                        <p>Admin Page</p>
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
    )
}

export default Page;