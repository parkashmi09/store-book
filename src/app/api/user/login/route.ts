import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import jwt from "jsonwebtoken";
import {TOKEN_SECRET} from "@/util/getUserDataWithToken";
import {API_URL} from "@/util/base_url";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { phone, password } = reqBody;

        const response= await fetch(`${API_URL}/login`,
            {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone,
                    password,
                }),
            })

        const userData = await response.json();
         if(userData.type=="block"){
            const nextResponse = NextResponse.json({
                message: "block",
                success: false,
            });
             return nextResponse;
        }
        else if(userData.type=="password"){
            const nextResponse = NextResponse.json({
                message: "password",
                success: false,
            });
             return nextResponse;
        }
        else if(userData.error=="error"){
            const nextResponse = NextResponse.json({
                message: "Sign failed",
                success: false,
            });
             return nextResponse;
        }
        else {

            const nextResponse = NextResponse.json({
                message: "login successful",
                success: true,
                data:userData.data,
                token:userData.token
            });

            nextResponse.cookies.set("token", userData.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 60, // 60 days
                path: "/",
            });

            return nextResponse;
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
