import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import z from 'https://esm.sh/zod'
import {gpt} from "../utils/gpt-client.ts";
import {getResponse, splitTextIntoPhrases} from "../utils/index.ts";

const schema = z.object({
    enabledGPT: z.boolean().optional(),
    text: z.string().min(1).max(2048),
})


serve(async (req) => {
    const {text, enabledGPT = false} = await req.json()
    try {
        schema.parse({text})
    } catch (error) {
        return getResponse((error as z.ZodError)?.issues)
    }
    console.log('extract-phrases - get text', {text: text.length, enabledGPT})


    if (!enabledGPT) {
        console.log('extract-phrases - using default method')
        const phrases = splitTextIntoPhrases(text);
        return getResponse({phrases})
    }

    try {
        console.log('extract-phrases - using GPT method')
        const phrases = await gpt.prompt(gpt.prompts.extractPhrasesFromTextPrompt(), text);
        return getResponse({phrases})
    } catch (e) {
        const phrases = splitTextIntoPhrases(text);
        return getResponse({phrases, error: e.message})
    }
})



