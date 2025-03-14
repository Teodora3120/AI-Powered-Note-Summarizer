import { Response, Request } from "express";
import "dotenv/config";
import OpenAI from "openai";

export async function getChatCompletion(
  prompt: string,
  req: Request,
  res: Response,
  temperature: number,
) {
  const openai = new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const stream = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-zero:free",
    messages: [{ role: "user", content: prompt }],
    temperature: temperature || 0.7,
    stream: true,
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let clientDisconnected = false;

  req.on("close", () => {
    console.log("❌ Client disconnected, stopping generation.");
    clientDisconnected = true;
  });

  // Keep checking if the client is disconnected
  const disconnectInterval = setInterval(() => {
    if (clientDisconnected) {
      console.log("🛑 Stopping response stream...");
      clearInterval(disconnectInterval);
      res.end();
    }
  }, 1000);

  try {
    for await (const part of stream) {
      if (clientDisconnected) break;
      const chunk = part.choices[0]?.delta?.content || "";
      res.write(chunk);
    }
  } catch (error) {
    console.error("⚠️ Streaming error:", error);
    res.write("Error occurred while streaming response.");
  } finally {
    clearInterval(disconnectInterval);
    res.end();
  }
}

export async function getChatCompletion2(prompt: string) {
  const openai = new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-zero:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });
  console.log(response, response.choices[0] || "");
}
