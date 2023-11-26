1. Make sure you have Deno extension installed
2. Create new edge function with a command  `supabase functions new <function-name>`
3. Serve the function with `supabase functions serve <function-name>`
4. Deploy the function with `supabase functions deploy stack-stats --project-ref <project-ref>`


Run with env variables:
```
supabase functions serve <function-name> --env-file .env.local
```