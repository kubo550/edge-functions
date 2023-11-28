import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import {getResponse} from "../_shared/utils/index.ts";
import {corsHeaders} from "../_shared/cors.ts";
import {db} from "../_shared/infrastructure/db.ts";
import z from "https://esm.sh/zod";


const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
})

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    if (req.method === 'GET') {
        try {
            const sets = await db.selectFrom('sets').select(['id', 'name', 'description', 'createdAt']).execute()

            return getResponse({result: sets})
        } catch (e) {
            console.log('sets - error', {error: e.message})
            return getResponse({error: e.message})
        }
    }

    if (req.method === 'POST') {
        const body = await req.json() as z.infer<typeof schema>
        try {
            schema.parse(body)
        } catch (error) {
            return getResponse((error as z.ZodError)?.issues)
        }

        try {
            const {name, description} = body
            await db.insertInto('sets').values({name, description}).execute()
            return getResponse({result: 'ok'})
        } catch (e) {
            console.log('sets - error', {error: e.message})
            return getResponse({error: e.message})
        }
    }

    return getResponse({error: 'Method not allowed'})

})
