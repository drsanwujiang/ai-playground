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
    const { model, data } = await request.json();

    const content_response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": serverConfig.keys.gemini,
        },
        body: JSON.stringify(data),
    });

    if (content_response.status !== 200) {
        return NextResponse.json({
            code: -2,
            message: "Failed to request Google AI Studio API"
        });
    }

    const content = (await content_response.json())?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
        return NextResponse.json({
            code: -3,
            message: "Failed to get content from Google AI Studio API"
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