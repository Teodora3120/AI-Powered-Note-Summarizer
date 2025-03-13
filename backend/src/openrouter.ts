import { Response } from "express";
import "dotenv/config";
import OpenAI from "openai";

export async function getChatCompletion(
  prompt: string,
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

  res.setHeader("Content-Type", "text/event-stream"); // Allows streaming
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const part of stream) {
      const chunk = part.choices[0]?.delta?.content || "";
      res.write(chunk); // Send chunks to frontend
    }
  } catch (error) {
    console.error("Streaming error:", error);
    res.write("Error occurred while streaming response.");
  } finally {
    res.end(); // Close stream when done
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
