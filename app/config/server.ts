import { SHA256 } from 'crypto-js';

export const getServerSideConfig = () => {
    let tokens;

    try {
        tokens = new Set((process.env.TOKEN?.split(",") ?? []).filter((v) => !!v).map((v) => SHA256(v.trim()).toString()));
    } catch (e) {
        tokens = new Set();
    }

    return {
        tokens: tokens,
        keys: {
            // Chat
            gpt: process.env.GPT_API_KEY || "",
            gemini: process.env.GEMINI_API_KEY || "",
            claude: process.env.CLAUDE_API_KEY || "",
            ernie: {
                api_key: process.env.ERNIE_API_KEY || "",
                secret_key: process.env.ERNIE_SECRET_KEY || "",
            },
            qwen: process.env.QWEN_API_KEY || "",

            // Paint
            dall_e: process.env.DALLE_API_KEY || "",
            stable_diffusion: process.env.SD_API_KEY || "",
        },
    };
}