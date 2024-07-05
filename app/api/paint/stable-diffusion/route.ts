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
  const {service, data} = await request.json();

  if (data.model === null) {
    delete data.model
  }

  const formData = new FormData();

  for (let key in data) {
    formData.append(key, data[key]);
  }

  const generation_response = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/${service}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serverConfig.keys.stable_diffusion}`,
      "Accept": "application/json"
    },
    body: formData
  });

  if (generation_response.status !== 200) {
    return NextResponse.json({
      code: -2,
      message: "Failed to request Stability AI API"
    });
  }

  const content = (await generation_response.json())?.image;

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