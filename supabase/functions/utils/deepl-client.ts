import DFetch from "https://deno.land/x/dfetch/mod.ts";

class DeeplClient {
    constructor(private readonly apiKey: string) {
    }

    async translate({text, targetLang = 'PL'}: { text: string, targetLang: string }): Promise<string> {
        const headers = {
            "Authorization": `DeepL-Auth-Key ${this.apiKey}`,
        }
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("target_lang", targetLang);
        console.log('sending request to deeplo', {text, targetLang});
        const response = await DFetch.post("https://api-free.deepl.com/v2/translate", params, {headers}) as {
            data: { translations: { text: string }[] }
        };
        console.log('response from deepl', {response});
        return response.data.translations[0].text;
    }
}

export const deepl = new DeeplClient(Deno.env.get("DEEPL_API_KEY") || '');