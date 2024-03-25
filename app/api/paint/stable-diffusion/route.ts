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
    data.samples = 1;
    data.response_format = "b64_json";

    if (!data.sampler) {
        delete data.sampler;
    }

    if (!data.style_preset) {
        delete data.style_preset;
    }

    const generation_response = await fetch(`https://api.stability.ai/v1/generation/${model}/text-to-image`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${serverConfig.keys.stable_diffusion}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (generation_response.status !== 200) {
        return NextResponse.json({
            code: -2,
            message: "Failed to request Stability AI API"
        });
    }

    const content = (await generation_response.json())?.artifacts?.[0]?.base64;

    if (!content) {
        return NextResponse.json({
            code: -3,
            message: "Failed to get content from Stability AI API"
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