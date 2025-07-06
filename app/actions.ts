"use server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export { generateMessage };

let openai: OpenAI | undefined;

const PROMPT = `Write a short, friendly LinkedIn outreach message to {{name}}, who is a {{role}} at {{company}}. Make it casual and under 500 characters.`;

async function generateMessage(leadId: string) {
  if (!openai) {
    openai = new OpenAI({
      baseURL:
        process.env.MODEL_PROVIDER === "DeepSeek"
          ? "https://api.deepseek.com"
          : "https://api.openai.com",
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select("name, role, company")
    .eq("id", leadId)
    .single();
  if (error || !lead) {
    console.error("Error fetching lead:", error);
    return { success: false, message: "Lead not found" };
  }

  const { name, role, company } = lead;
  if (!name || !role || !company) {
    return { success: false, message: "Lead information is incomplete" };
  }

  console.log(`Generating message for lead: ${name}, ${role}, ${company}`);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that writes LinkedIn outreach messages.",
      },
      {
        role: "user",
        content: PROMPT.replace("{{name}}", name)
          .replace("{{role}}", role)
          .replace("{{company}}", company),
      },
    ],
    model: process.env.MODEL_NAME || "gpt-3.5-turbo",
  });

  const message = completion.choices[0].message;
  return { success: true, message: message.content };
}
