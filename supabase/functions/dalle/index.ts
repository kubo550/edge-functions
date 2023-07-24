import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

import { OpenAI } from "https://deno.land/x/openai/mod.ts";

const openaiapikey = Deno.env.get('OPENAI_API_KEY');
const openAI = new OpenAI(openaiapikey!);



serve(async (req) => {
  const completion = await openAI.createCompletion({
    model: "davinci",
    prompt: "The meaning of life is",
  });

  console.log(completion.choices);

  const data = completion.choices ? completion.choices[0] : { message: "Hello from Functions!" }
  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
