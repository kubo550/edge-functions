import {serve} from "https://deno.land/std@0.168.0/http/server.ts"

import {OpenAI} from "https://deno.land/x/openai/mod.ts";

const openaiapikey = Deno.env.get('OPENAI_API_KEY');
const openAI = new OpenAI(openaiapikey!);


serve(async (req) => {

    const {prompt} = await req.json()

    console.log('Generating image for prompt: ', prompt)

    if (!prompt) {
        return new Response(
            JSON.stringify({error: 'Prompt is required'}),
            {headers: {"Content-Type": "application/json"}},
        )
    }

    if (prompt.length > 2048) {
        return new Response(
            JSON.stringify({error: 'Prompt is too long. Maximum length is 2048 characters.'}),
            {headers: {"Content-Type": "application/json"}},
        )
    }
    const openAiResponse = await openAI.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
    });

    const imageUlr = openAiResponse.data[0].url;

    console.log('Image has been generated! ', imageUlr)
    return new Response(
        JSON.stringify({imageUlr}),
        {headers: {"Content-Type": "application/json"}},
    )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
