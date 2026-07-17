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
    className?:string;
}
function BurgerNav({children,Logo,Burger,className}:BurgerNavProps){
    return (
        <div className={'secondaryUI px-5 min-h-15 flex items-center justify-between burgerNav '+(className??'')}>
            {Logo}
            {children}
            {Burger}
        </div>
    )
}

BurgerNav.Logo = Logo;
BurgerNav.Burger = Burger;

export default BurgerNav;