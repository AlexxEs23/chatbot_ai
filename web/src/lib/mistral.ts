import { Mistral } from "@mistralai/mistralai";
import type { ChatCompletionResponse } from "@mistralai/mistralai/models/components";
const aggentId = "ag_019a3b55fc8072d79caa6f145f71d8b5";
export async function mistral(
  message: string
): Promise<ChatCompletionResponse> {
  try {
    const mistral = new Mistral({
      apiKey: "9eirjHtjgtiqDRvEe8Z4dHvmK3sygK16",
    });

    const response = await mistral.agents.complete({
      agentId: aggentId,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    console.log("Mistral response:", response);
    return response;
  } catch (e) {
    console.error("Error in mistral function:", e);
    return e as ChatCompletionResponse;
  }
}
