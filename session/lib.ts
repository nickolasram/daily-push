import { SessionOptions } from "iron-session";

export interface SessionData {
    username?: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
    password: process.env.NEXT_PUBLIC_IRON_SECRET!,
    cookieName: "push-session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
};

