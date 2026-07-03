"use server"
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {SessionData, sessionOptions} from "@/session/lib";

export async function getSession(){
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
        session.isLoggedIn = false;
    }
    return session;
}

export async function logout(){
    const session = await getSession();
    session.destroy();
}