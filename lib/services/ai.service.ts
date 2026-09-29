import { IIntegration } from "@/lib/db/models/ProductInstance";
import { SHOPIFY_MOCK_DATA, CRM_MOCK_DATA } from "@/lib/services/mock-data";

interface AICallOptions {
  userMessage: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  integrations: IIntegration[];
  projectName: string;
}

interface AIResult {
  content: string;
  steps: string[];
}

function buildSystemPrompt(
  integrations: IIntegration[],
  projectName: string
): string {
  const enabledIntegrations = integrations.filter((i) => i.enabled);
  
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let systemPrompt = `You are an intelligent AI Sales Assistant for ${projectName}. 
You help with product recommendations, order tracking, customer inquiries, and sales support.
Be concise, helpful, and professional. Keep responses under 200 words unless asked for detail.

SYSTEM INFO:
Today's real current date is ${currentDate}. Always use this as the true current date. Do NOT confuse historical order dates in the store data with today's date.`;

  if (enabledIntegrations.length > 0) {
    systemPrompt += `\n\nYou have access to the following live data:`;

    if (enabledIntegrations.find((i) => i.type === "shopify")) {
      systemPrompt += `\n\nSHOPIFY STORE DATA:
${JSON.stringify(SHOPIFY_MOCK_DATA, null, 2)}
Use this data to answer product, inventory, and order questions.`;
    }

    if (enabledIntegrations.find((i) => i.type === "crm")) {
      systemPrompt += `\n\nCRM DATA:
${JSON.stringify(CRM_MOCK_DATA, null, 2)}
Use this data to answer customer and relationship questions.`;
    }
  }

  return systemPrompt;
}

function buildSteps(integrations: IIntegration[]): string[] {
  const steps: string[] = [];
  const enabled = integrations.filter((i) => i.enabled);

  steps.push("Analyzing your message...");

  if (enabled.find((i) => i.type === "shopify")) {
    steps.push("Fetching Shopify inventory & order data...");
  }
  if (enabled.find((i) => i.type === "crm")) {
    steps.push("Querying CRM customer records...");
  }

  steps.push("Generating response...");
  return steps;
}

export async function generateAIResponse(
  options: AICallOptions
): Promise<AIResult> {
  const { userMessage, conversationHistory, integrations, projectName } =
    options;

  const steps = buildSteps(integrations);
  const systemPrompt = buildSystemPrompt(integrations, projectName);

  // Try Gemini first
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await callGemini(
        userMessage,
        conversationHistory,
        systemPrompt
      );
      return { content: result, steps };
    } catch (err) {
      console.error("[Provider Error] Gemini generation failed:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Try OpenRouter fallback
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const result = await callOpenRouter(
        userMessage,
        conversationHistory,
        systemPrompt
      );
      return { content: result, steps };
    } catch (err) {
      console.error("[Provider Error] OpenRouter generation failed:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Throw error if all providers fail
  throw new Error("AI_PROVIDER_FAILED");
}

async function callGemini(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  const rawModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const MODEL = rawModel.replace(/^google\//, "");

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    // Safely extract status without logging full HTML/payloads indiscriminately
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No content returned from Gemini");
  return text;
}

async function callOpenRouter(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<string> {
  const MODEL = process.env.OPENROUTER_MODEL || "inclusionai/ling-3.0-flash-sante:free";
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "ConverseOS AI Assistant",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: userMessage },
        ],
        max_tokens: 512,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    // Parse JSON error safely to prevent logging secrets, fallback to status
    let safeError = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error && parsed.error.message) {
        safeError += ` - ${parsed.error.message}`;
      }
    } catch {
      safeError += ` ${response.statusText}`;
    }
    throw new Error(safeError);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "I couldn't generate a response.";
}


