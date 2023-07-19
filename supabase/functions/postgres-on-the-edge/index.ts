import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

console.log(`Function "postgres-on-the-edge" up and running!`);

const SUPABASE_URL = Deno.env.get("DATABASE_URL") || '';

const pool = new Pool(SUPABASE_URL, 3, true);

serve(async (_req) => {
  try {
    // Grab a connection from the pool
    const connection = await pool.connect();

    try {
      // Run a query
      const result = await connection.queryObject`SELECT * FROM "Topic"`;
      const animals = result.rows; // [{ id: 1, name: "Lion" }, ...]

      // Encode the result as pretty printed JSON
      const body = JSON.stringify(
          animals,
          (key, value) => (typeof value === "bigint" ? value.toString() : value),
          2
      );

      // Return the response with the correct content type header
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});