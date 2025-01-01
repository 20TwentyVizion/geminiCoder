import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { prompt, currentCode } = await req.json();

    if (!prompt || !currentCode) {
      return NextResponse.json(
        { error: "Missing prompt or current code" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `You are an expert code assistant. You will receive the current code and a request for changes.
Your task is to modify the code according to the request while:
1. Preserving the existing code structure unless changes are needed
2. Maintaining code style and conventions
3. Only returning the complete, updated code without explanations

Current code:
${currentCode}

Requested changes:
${prompt}

Return only the modified code without any explanations or markdown formatting.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const updatedCode = response.text();

    // Store the iteration in the database
    const iteration = await prisma.codeIteration.create({
      data: {
        code: updatedCode,
        prompt,
        model: "gemini-1.5-pro",
        shadcn: false,
        generatedApp: {
          create: {
            code: updatedCode,
            prompt,
            model: "gemini-1.5-pro",
          },
        },
      },
    });

    return NextResponse.json({ updatedCode });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update code" },
      { status: 500 }
    );
  }
}
