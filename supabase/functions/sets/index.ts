import {getResponse} from "../_shared/utils/index.ts";


import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import {corsHeaders} from "../_shared/cors.ts";
import {db} from "../_shared/infrastructure/db.ts";


serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {

        if (req.method === 'GET') {
            try {
                const sets = await db.selectFrom('sets').select(['id', 'name', 'description', 'createdAt']).execute()

                return getResponse({result: sets})
            } catch (e) {
                console.log('sets - error', {error: e.message})
                return getResponse({error: e.message})
            }
        } else if (req.method === 'POST') {
            try {
                const {name, description} = await req.json() as { name: string, description: string }
                await db.insertInto('sets').values({name, description}).execute()
                return getResponse({result: 'ok'})
            }  catch (e) {
                console.log('sets - error', {error: e.message})
                return getResponse({error: e.message})
            }
        }

        return getResponse({error: 'Method not allowed'})
    } catch (err) {
        console.error(err.message);
        return getResponse({error: err.message})
    }
})
