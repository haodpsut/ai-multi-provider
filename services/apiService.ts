
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProviderId, ApiResponse, ApiServiceParams, ModelType } from '../types';
import { PROVIDERS } from '../constants';

const callGeminiApi = async ({ apiKey, model, prompt, imageBase64 }: ApiServiceParams): Promise<ApiResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        
        const contents = imageBase64
            ? { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }] }
            : prompt;
        
        const config: { tools?: any[] } = {};
        // Add Google Search grounding if it seems like a knowledge-based question
        const knowledgeTriggers = ['who is', 'what is', 'explain', 'latest', 'news about'];
        if (!imageBase64 && knowledgeTriggers.some(t => prompt.toLowerCase().startsWith(t))) {
            config.tools = [{googleSearch: {}}];
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents,
            ...(Object.keys(config).length > 0 && { config }),
        });
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const citations = groundingMetadata?.groundingChunks
            ?.map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri) || [];

        return { text: response.text, isLoading: false, citations };

    } catch (e: any) {
        console.error("Gemini API Error:", e);
        throw new Error(e.message || "Failed to call Gemini API");
    }
};

const callOpenRouterApi = async ({ apiKey, model, prompt, imageBase64 }: ApiServiceParams): Promise<ApiResponse> => {
    try {
        const messages: any[] = [{ role: "user", content: [] }];
        messages[0].content.push({ type: "text", text: prompt });
        if (imageBase64) {
            messages[0].content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } });
        }
        
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ model, messages }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`OpenRouter Error: ${errorData.error?.message || res.statusText}`);
        }

        const data = await res.json();
        return { text: data.choices[0].message.content, isLoading: false };
    } catch (e: any) {
        console.error("OpenRouter API Error:", e);
        throw new Error(e.message || "Failed to call OpenRouter API");
    }
};

const callNovitaApi = async ({ apiKey, model, prompt }: ApiServiceParams): Promise<ApiResponse> => {
     try {
        const res = await fetch("https://api.novita.ai/v3/text-to-image", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model_name: model,
                prompt: prompt,
                negative_prompt: "",
                width: 1024,
                height: 1024,
                n_iter: 1,
            }),
        });
        if (!res.ok) {
             const errorData = await res.json();
             throw new Error(`Novita Error: ${errorData.reason || res.statusText}`);
        }
        const data = await res.json();
        if (data.images && data.images.length > 0) {
            return { imageUrl: data.images[0].image_url, isLoading: false };
        }
        throw new Error("Novita API did not return any images.");

     } catch(e: any) {
        console.error("Novita AI API Error:", e);
        throw new Error(e.message || "Failed to call Novita AI API");
     }
};

const callFireworksApi = async ({ apiKey, model, prompt, imageBase64 }: ApiServiceParams): Promise<ApiResponse> => {
    const providerModel = PROVIDERS.find(p => p.id === 'fireworks')?.models.find(m => m.id === model);
    if (!providerModel) throw new Error(`Model ${model} not found for Fireworks AI`);

    try {
        if (providerModel.type === ModelType.IMAGE) {
            const res = await fetch("https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-base-1.0", {
                method: "POST",
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, n: 1, size:"1024x1024", response_format: "b64_json" }),
            });
            if (!res.ok) throw new Error(`Fireworks Image Gen Error: ${res.statusText}`);
            const data = await res.json();
            return { imageUrl: `data:image/png;base64,${data[0].b64_json}`, isLoading: false };
        } else { // TEXT or VISION
             const messages: any[] = [{ role: "user", content: [{ type: "text", text: prompt }] }];
             if (imageBase64) {
                 messages[0].content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } });
             }
            const res = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model, messages, max_tokens: 1024 }),
            });
             if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Fireworks Chat Error: ${errorData.fault?.faultstring || res.statusText}`);
            }
            const data = await res.json();
            return { text: data.choices[0].message.content, isLoading: false };
        }
    } catch(e: any) {
        console.error("Fireworks API Error:", e);
        throw new Error(e.message || "Failed to call Fireworks API");
    }
};


export const callApi = (providerId: ProviderId, params: ApiServiceParams): Promise<ApiResponse> => {
    switch (providerId) {
        case ProviderId.GEMINI:
            return callGeminiApi(params);
        case ProviderId.OPENROUTER:
            return callOpenRouterApi(params);
        case ProviderId.NOVITA:
            return callNovitaApi(params);
        case ProviderId.FIREWORKS:
            return callFireworksApi(params);
        default:
            throw new Error("Unknown provider");
    }
};
