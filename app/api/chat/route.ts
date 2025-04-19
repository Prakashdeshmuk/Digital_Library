// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // CORS handling remains the same
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { message, pageText } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const apiKey = config.env.gemini_key;
    // Updated to v1 API version
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
      You are a helpful assistant.  When replying, always follow this generic Markdown template:

      1. **Title**  
        Begin with a level‑2 heading naming what you’re delivering.

      2. **Summary**  
        One‑ or two‑sentence overview.

      3. **Details**  
        The full answer (bullet list, numbered steps, or paragraphs).

      4. **Examples** *(optional)*  
        If relevant, include a “### Examples” or “### Code” section with fenced code blocks.

       add \ after ending of each line in the response  

      Now, here is the page text:
      \`\`\`
      i am Reading book whose current pageText content ${pageText} and my question is ${message}
      \`\`\`
      `;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return NextResponse.json(
        { error: `Gemini API Error: ${JSON.parse(errorText).error.message}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    let outputText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      throw new Error("No valid response from Gemini API");
    }
    return NextResponse.json(
      { message: outputText },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
