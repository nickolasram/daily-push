import {ReactNode} from "react";

interface ChildProps {
    children: ReactNode;
}

function Btn({children}:ChildProps){
    return (
        <>
            {children}
        </>
    )
}

function Form({children}:ChildProps){
    return (
        <>
            {children}
        </>
    )
}

interface BtnPopupProps {
    btn?: ReactNode;
    form?: ReactNode;
    children?:ReactNode;
}

function BtnPopup({btn,children,form}:BtnPopupProps){
    return (
        <>
            {btn}
            {children}
            {form}
        </>
    )
}

BtnPopup.Btn = Btn;
BtnPopup.Form = Form;

export default BtnPopup;