import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import z from 'https://esm.sh/zod'
import {getResponse, toPhrase} from "../_shared/utils/index.ts";
import {deepl} from "../_shared/infrastructure/deepl-client.ts";
import {corsHeaders} from "../_shared/cors.ts";
import _ from 'lodash'
import {Phrase} from "../types/index.ts";

const schema = z.object({
    targetLang: z.string().optional(),
    phrases: z.array(z.object({
        id: z.string().optional(),
        phrase: z.string().max(100),
    })).max(100),

});

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

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

    const uniquePhrases = _.uniqBy(_.map(_.compact(phrases), (p: Phrase) => p.phrase?.trim()?.toLowerCase(), 'phrase'));

    try {
        const translatedText = await deepl.translate({text: uniquePhrases.join('; '), targetLang})
        const translatedPhrases = translatedText.split('; ').map((meaning, index) =>
            toPhrase({phrase: uniquePhrases[index], meaning})
        )
        console.log('translate - translated phrases', {translatedPhrases: translatedPhrases.length})
        return getResponse({response: translatedPhrases})

    } catch (e) {
        console.log('translate - error', {error: e.message})
        return getResponse({error: e.message})
    }
})
