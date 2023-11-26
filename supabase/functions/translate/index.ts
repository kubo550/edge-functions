import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import z from 'https://esm.sh/zod'
import {getResponse, toPhrase} from "../utils/index.ts";
import {deepl} from "../utils/deepl-client.ts";


const schema = z.object({
    targetLang: z.string().optional(),
    phrases: z.array(z.object({
        id: z.string().optional(),
        phrase: z.string().max(100),
    })).max(100),

});

serve(async (req) => {
    const {phrases, targetLang = 'PL'} = await req.json() as {
        phrases: { id?: string, phrase: string }[],
        targetLang: string
    }
    console.log('translate - get phrases to translate', {phrases: phrases.length})
    try {
        schema.parse({phrases})
    } catch (error) {
        return getResponse((error as z.ZodError)?.issues)
    }

    const text = phrases.map(({phrase}) => phrase).join('; ')

    try {
        const translatedText = await deepl.translate({text, targetLang})
        const translatedPhrases = translatedText.split('; ').map((meaning, index) =>
            toPhrase({phrase: phrases[index].phrase, meaning, id: phrases[index].id})
        )
        console.log('translate - translated phrases', {translatedPhrases: translatedPhrases.length})
        return getResponse({response: translatedPhrases})

    } catch (e) {
        console.log('translate - error', {error: e.message})
        return getResponse({error: e.message})
    }
})
