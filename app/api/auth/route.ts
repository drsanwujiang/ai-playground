import {NextRequest, NextResponse} from 'next/server';

import {authenticate} from "@/app/actions";

export async function OPTIONS() {
  return NextResponse.json({
    code: 0,
    message: "Success"
  }, {
    status: 200
  })
}

export async function POST(request: NextRequest) {
  const token = (await request.json()).token;

  if (!authenticate(token)) {
    return NextResponse.json({
      code: -1,
      message: "Token invalid"
    }, {status: 401});
  }

  const response = NextResponse.json({
    code: 0,
    message: "Success"
  });

  response.cookies.set('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  });

  return response;
}