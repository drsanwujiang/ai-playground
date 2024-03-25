import { NextRequest, NextResponse } from 'next/server';
import { getServerSideConfig } from "@/app/config/server";

export async function OPTIONS() {
    return NextResponse.json({
        code: 0,
        message: "Success"
    }, {
        status: 200
    });
}

export async function POST(request: NextRequest) {
    const serverConfig = getServerSideConfig();

    const token_response = await fetch("https://aip.baidubce.com/oauth/2.0/token?" + new URLSearchParams({
        grant_type: "client_credentials",
        client_id: serverConfig.keys.ernie.api_key,
        client_secret: serverConfig.keys.ernie.secret_key,
    }), {
        method: "POST",
    });

    if (token_response.status !== 200) {
        return NextResponse.json({
            code: -2,
            message: "Failed to get Baidu BCE access token"
        });
    }

    const { access_token } = await token_response.json();
    const { model, data } = await request.json();

    const completion_response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${model}?` + new URLSearchParams({
        access_token,
    }), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (completion_response.status !== 200) {
        return NextResponse.json({
            code: -2,
            message: "Failed to request Baidu BCE API"
        });
    }

    const content = (await completion_response.json())?.result;

    if (!content) {
        return NextResponse.json({
            code: -3,
            message: "Failed to get content from Baidu BCE API"
        });
    }

    return NextResponse.json({
        code: 0,
        message: "Success",
        data: {
            content
        }
    });
}