// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import _ from 'lodash'

console.log("Hello from Functions!")

serve(async (req) => {
    if (req.method === "GET") {
        return new Response(
            JSON.stringify({message: "Hello from Functions!"}),
            {headers: {"Content-Type": "application/json"}},
        )
    }

    const {name} = await req.json()

    const data = _.omit({name, age: 1}, 'name')

    return new Response(
        JSON.stringify(data),
        {headers: {"Content-Type": "application/json"}},
    )
})
