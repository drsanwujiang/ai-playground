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

  const generation_response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serverConfig.keys.qwen}`,
      "Content-Type": "application/json"
    },
    body: await request.text()
  });

  if (generation_response.status !== 200) {
    return NextResponse.json({
      code: -2,
      message: "Failed to request Aliyun DashScope API"
    });
  }

  const content = (await generation_response.json())?.output.text;

  if (!content) {
    return NextResponse.json({
      code: -3,
      message: "Failed to get content from Aliyun DashScope API"
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