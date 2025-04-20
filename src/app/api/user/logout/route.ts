import { NextResponse } from "next/server";


export async function GET() {
    try {
        // console.log("called logout")
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            }
        )
        response.cookies.delete('token')
        response.cookies.set("token", "",
            { httpOnly: true, expires: new Date(0)
            });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
