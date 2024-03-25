import { cookies } from 'next/headers'
import { getServerSideConfig } from "@/app/config/server";

export function authenticate(given_token = undefined) {
    const serverConfig = getServerSideConfig();
    const token = given_token ?? cookies().get("token")?.value ?? "";

    return serverConfig.tokens.has(token);
}