import {NextRequest, NextResponse} from 'next/server';
import {getServerSideConfig} from "@/app/config/server";

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

  const completion_response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serverConfig.keys.gpt}`,
      "Content-Type": "application/json"
    },
    body: await request.text()
  });

  if (completion_response.status !== 200) {
    return NextResponse.json({
      code: -2,
      message: "Failed to request OpenAI API"
    });
  }

  const content = (await completion_response.json())?.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json({
      code: -3,
      message: "Failed to get content from OpenAI API"
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