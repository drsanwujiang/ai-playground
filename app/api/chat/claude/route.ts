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
    const { data } = await request.json();

    const message_response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": serverConfig.keys.claude,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(data),
    });

    if (message_response.status !== 200) {
        return NextResponse.json({
            code: -2,
            message: "Failed to request Anthropic API"
        });
    }

    const content = (await message_response.json())?.content?.[0]?.text;

    if (!content) {
        return NextResponse.json({
            code: -3,
            message: "Failed to get content from Anthropic API"
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