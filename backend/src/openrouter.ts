import "dotenv/config";

import OpenAI from "openai";

export async function getChatCompletion(prompt: string) {
  const openai = new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-zero:free",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
