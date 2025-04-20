import {NextRequest} from "next/server";
// @ts-ignore
import jwt from "jsonwebtoken";

export const  TOKEN_SECRET = "testingToken";
export const getUserDataWithToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        return jwt.verify(token, TOKEN_SECRET);
    } catch (error: any) {
        return ""
    }
}
export const getUserDataWithCookieValue = (cookieValue: string | null | undefined) => {
    try {
        // console.log(cookieValue)
        return jwt.verify(cookieValue, TOKEN_SECRET);
    } catch (error: any) {
        return "";
    }
}
