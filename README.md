## Clone and run locally

1. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   OPENAI_API_KEY=[INSERT OPENAI API KEY]

   # Optional. If you want to use DeepSeek instead of OpenAI, set these variables:
   MODEL_PROVIDER=DeepSeek
   MODEL_NAME=deepseek-chat
   ```

2. Run [scripts](./scripts/) to setup DB.

3. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).


4. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
