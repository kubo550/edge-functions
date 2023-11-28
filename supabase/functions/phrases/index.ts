import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import {getResponse} from "../_shared/utils/index.ts";
import {corsHeaders} from "../_shared/cors.ts";
import {db} from "../_shared/infrastructure/db.ts";
import z from "https://esm.sh/zod";


const schema = z.object({
    setId: z.string().min(1).max(100),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  if (req.method === 'GET') {
    const queryParams = new URL(req.url, 'https://example.com').searchParams
    const params = {setId: queryParams.get('setId')}

    try {
      schema.parse(params)
    } catch (error) {
      return getResponse((error as z.ZodError)?.issues)
    }

    try {
      const sets = await db.selectFrom('phrases').select(['id', 'phrase', 'meaning']).where('setId', '=', params.setId).execute()

      return getResponse({result: sets})
    } catch (e) {
      console.log('sets - error', {error: e.message})
      return getResponse({error: e.message})
    }
  }

  return getResponse({error: 'Method not allowed'})

})
