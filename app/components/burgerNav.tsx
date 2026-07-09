import {ReactNode} from "react";

interface childProp{
    children?: ReactNode;
}
function Logo({children}:childProp){
    return (
        <div>
            {children}
        </div>
    )
}

function Burger({children}:childProp){
    return (
        <>
            {children}
        </>
    )
}

interface BurgerNavProps {
    children?: ReactNode;
    Logo?:ReactNode;
    Burger?:ReactNode;
}
function BurgerNav({children,Logo,Burger}:BurgerNavProps){
    return (
        <div className={'bg-gray-950 border-b-2 border-gray-400 px-5 min-h-15 flex items-center justify-between'}>
            {Logo}
            {children}
            {Burger}
        </div>
    )
}

BurgerNav.Logo = Logo;
BurgerNav.Burger = Burger;

export default BurgerNav;