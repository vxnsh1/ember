"use server";

const generateResponse = async (
  data: string,
  roastMode: { title: string; subtitle: string; description: string },
) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const prompt = `You are a website named Ember that provides feedback on user-submitted content.

RULES:
1. Always respond in a single paragraph.
2. Maintain a "${roastMode.title}" tone throughout your response.
3. Follow the instructions: ${roastMode.description}
4. Do not include any prefixes, greetings, emojis, em-dashes, or bullet points.
5. Only use the context provided; nothing else.

CONTEXT:
${data}

OUTPUT FORMAT:
- A single paragraph of feedback, about 3-4 sentences long.
- Feedback must strictly follow the specified tone.
- No line breaks, bullet points, enumerations, or extra commentary.
`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://ember.com",
        "X-Title": "Ember",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content;
    let output: string | undefined;
    if (typeof raw === "string") {
      output = raw;
    } else if (Array.isArray(raw)) {
      output = raw
        .map((part: unknown) => {
          if (typeof part === "string") return part;
          if (part && typeof part === "object" && "text" in part) {
            return String((part as { text: string }).text);
          }
          return "";
        })
        .join("");
    } else if (raw != null) {
      output = String(raw);
    }
    return output?.trim() || "Failed to generate feedback.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "Failed to generate feedback.";
  }
};

export default generateResponse;
