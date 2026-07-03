import { SessionOptions, getIronSession } from "iron-session";

export interface SessionData {
    _id?: string;
    admin?: boolean;
    streamer?: boolean;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
    password: process.env.NEXT_PUBLIC_IRON_SECRET!,
    cookieName: "hive-session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
};

