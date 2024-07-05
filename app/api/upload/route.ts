import {NextRequest, NextResponse} from 'next/server';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {v4 as UUIDv4} from 'uuid';
import {getServerSideConfig} from '@/app/config/server';

export async function POST(request: NextRequest) {
  const serverConfig = getServerSideConfig();
  const s3 = new S3Client({
    region: serverConfig.s3.region,
    credentials: {
      accessKeyId: serverConfig.s3.access_key_id,
      secretAccessKey: serverConfig.s3.secret_access_key
    }
  });

  const file = (await request.formData()).get("file") as File;
  const filename = UUIDv4();

  try {
    await s3.send(new PutObjectCommand({
      Bucket: serverConfig.s3.bucket,
      Key: filename,
      Body: (await file.arrayBuffer()) as Buffer
    }));
  } catch (e) {
    return NextResponse.json({
      code: -2,
      message: "Failed to upload file"
    });
  }

  let signedUrl;

  try {
    const command = new GetObjectCommand({
      Bucket: serverConfig.s3.bucket,
      Key: filename
    });
    signedUrl = await getSignedUrl(s3, command, {expiresIn: 3600});
  } catch (e) {
    return NextResponse.json({
      code: -3,
      message: "Failed to get signed URL"
    });
  }

  return NextResponse.json({
    code: 0,
    message: "Success",
    data: {
      url: signedUrl
    }
  });
}