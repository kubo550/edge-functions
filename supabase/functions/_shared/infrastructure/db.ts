import {
    Kysely,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
} from 'https://esm.sh/kysely@0.23.4'
import {Pool} from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

import {PostgresDriver} from "./deno-postgres-driver.ts";

const SUPABASE_URL = Deno.env.get("DATABASE_URL") || '';
const pool = new Pool(SUPABASE_URL, 3, true);

interface SetTable {
    id?: number
    name: string
    description: string
    createdAt?: string
}

interface Database {
    sets: SetTable
}

export const db = new Kysely<Database>({
    dialect: {
        createAdapter() {
            return new PostgresAdapter()
        },
        createDriver() {
            return new PostgresDriver({pool})
        },
        createIntrospector(db: Kysely<unknown>) {
            return new PostgresIntrospector(db)
        },
        createQueryCompiler() {
            return new PostgresQueryCompiler()
        },
    },
})