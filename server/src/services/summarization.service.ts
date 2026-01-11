import dotenv from "dotenv";
import { OllamaResponse } from "../interfaces/interfaces";

dotenv.config();

const SUMMARIZATION_PROMPT = `Tu es un expert en analyse de transcriptions de réunions et en création de résumés concis et actionnables.

Analyse la transcription de réunion suivante et crée un résumé structuré avec :

1. Points clés (3-5 points principaux discutés)
2. Actions à entreprendre (tâches, décisions, ou prochaines étapes)
3. Mentions importantes (personnes, projets, ou échéances mentionnés)

Garde le résumé concis et professionnel. Utilise des bullet points pour la clarté.

Transcription :
{transcription}

Résumé :`;

/**
 * Generates a summary from transcription using Ollama
 * @param transcription The transcription text to summarize
 * @returns Summary text
 */
export async function generateSummary(transcription: string): Promise<string> {
    const ollamaUrl = process.env.OLLAMA_API_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

    if (!transcription || transcription.trim().length < 10) {
        throw new Error("Transcription is empty or too short to summarize");
    }

    const prompt = SUMMARIZATION_PROMPT.replace("{transcription}", transcription);

    console.log(`Generating summary with ${model}...`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    num_predict: 500, // Max tokens for summary
                },
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Model ${model} not found. Run: ollama pull ${model}`);
            }
            throw new Error(`Ollama request failed with status ${response.status}`);
        }

        const data = (await response.json()) as OllamaResponse;

        if (!data || !data.response) {
            throw new Error("Invalid response from Ollama");
        }

        // Remove ** markdown bold syntax
        return data.response.replace(/\*\*/g, "");
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("Ollama request timed out after 2 minutes");
        }
        if (error.cause?.code === "ECONNREFUSED") {
            throw new Error("Cannot connect to Ollama. Make sure Ollama is running.");
        }
        throw new Error(`Ollama summarization failed: ${error.message}`);
    }
}
