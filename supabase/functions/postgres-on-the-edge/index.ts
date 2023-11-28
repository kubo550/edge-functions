import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import {getResponse} from "../_shared/utils/index.ts";

console.log(`Function "postgres-on-the-edge" up and running!`);

const SUPABASE_URL = Deno.env.get("DATABASE_URL") || '';
console.log('SUPABASE_URL', SUPABASE_URL)
const pool = new Pool(SUPABASE_URL, 3, true);

serve(async (req) => {

  try {
    // Grab a connection from the pool
    const connection = await pool.connect();

    try {
      const result = await connection.queryObject`SELECT * FROM "sets"`;
      const sets = result.rows as {id: string, name: string, description: string, createdAt: string}[]

      console.log('sets', {sets: sets.length})
      return getResponse({result: sets})


    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  } catch (err) {
    console.error(err);
    getResponse({error: err.message})
  }
});