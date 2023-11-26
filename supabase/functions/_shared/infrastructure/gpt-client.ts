import {OpenAI} from "https://deno.land/x/openai/mod.ts";
const gptClient = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY") || '',
});

class GptClient {

    async prompt(systemPrompt: string, userPrompt: string): Promise<string> {
        const chatCompletion = await gptClient.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userPrompt},
            ],
            max_tokens: 1024,
            model: Deno.env.get("OPENAI_MODEL") || '',
        });

        return chatCompletion.choices[0].message.content || '';
    }

    get prompts() {
        return {
            extractPhrasesFromTextPrompt() {
                return 'Divide this text into segments of a few words each, suitable for use on flashcards for foreign language learning. You can skip obvious words such as \'and\', \'so\', \'the\', etc., if they are at the beginning or end of a phrase. Respond only with a JSON of the type phrases: [{phrase: string}]. Do not add anything beyond the JSON. Now, I am pasting the text: '
            },
        }
    }

}

export const gpt = new GptClient();