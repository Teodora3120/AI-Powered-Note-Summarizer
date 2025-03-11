/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import "dotenv/config";

export async function getChatCompletionAxios(prompt: string) {
  try {
    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "deepseek/deepseek-r1-zero:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("API Response:", response.data);
    return response.data.choices[0].message.content;
  } catch (err: any) {
    console.error("Error fetching chat completion:", err);
    throw new Error("Failed to get chat completion");
  }
}
