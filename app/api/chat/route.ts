import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Make sure to load environment variables
const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_AI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    let json = await req.json();
    let result = z
      .object({
        message: z.string(),
      })
      .safeParse(json);

    if (result.error) {
      console.error("Validation error:", result.error);
      return new Response(
        JSON.stringify({ error: "Invalid message format" }), 
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message } = result.data;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return new Response(
        JSON.stringify({ response: text }), 
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate response" }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const runtime = "edge";
