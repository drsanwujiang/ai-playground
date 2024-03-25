export function auth(token: string) {
    return fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
}

export function requestGPT(data: object) {
    return fetch("/api/chat/gpt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
}

export function requestClaude(data: object) {
    return fetch("/api/chat/claude", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
}

export function requestGemini(model: string, data: object) {
    return fetch("/api/chat/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, data }),
    });
}

export function requestErnie(model: string, data: object) {
    return fetch("/api/chat/ernie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, data }),
    });
}

export function requestQwen(data: object) {
    return fetch("/api/chat/qwen", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
}

export function requestDALLE(data: object) {
    return fetch("/api/paint/dall-e", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
}

export function requestStableDiffusion(model: string, data: object) {
    return fetch("/api/paint/stable-diffusion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, data }),
    });
}