import { ReceiptData } from "../types";

const apiKey = process.env.OPENROUTER_API_KEY || "";
console.log("API Key loaded:", apiKey ? `${apiKey.substring(0, 15)}...` : "EMPTY");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function scanReceipt(base64Image: string): Promise<ReceiptData> {
  // Ensure we have the full data URL format
  let imageUrl = base64Image;
  if (!base64Image.startsWith("data:")) {
    imageUrl = `data:image/jpeg;base64,${base64Image}`;
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Gemini OCR Receipt Scanner",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: "text",
              text: `Extract all receipt details from this image. Return ONLY a valid JSON object with these exact fields:
{
  "merchant": "store name",
  "date": "YYYY-MM-DD format",
  "category": "one of: Food & Drink, Travel, Supplies, Utilities, Other",
  "subtotal": number (without currency symbol),
  "tax": number (without currency symbol),
  "total": number (without currency symbol),
  "confidence": number between 0 and 1 indicating extraction accuracy,
  "currency": "USD" or appropriate currency code
}

Be very precise with amounts and dates. Return ONLY the JSON, no other text.`,
            },
          ],
        },
      ],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("OpenRouter API error:", errorData);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Failed to extract data from receipt.");
  }

  // Parse the JSON response, handling potential markdown code blocks
  let jsonText = content.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3);
  }
  jsonText = jsonText.trim();

  return JSON.parse(jsonText) as ReceiptData;
}
