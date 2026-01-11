import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUMMARIZATION_PROMPT = `Tu es un expert en analyse de transcriptions de réunions et en création de résumés concis et actionnables.

Analyse la transcription de réunion suivante et crée un résumé structuré avec :

1. **Points clés** (3-5 points principaux discutés)
2. **Actions à entreprendre** (tâches, décisions, ou prochaines étapes)
3. **Mentions importantes** (personnes, projets, ou échéances mentionnés)

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
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    if (!transcription || transcription.trim().length < 10) {
        throw new Error('Transcription is empty or too short to summarize');
    }

    const prompt = SUMMARIZATION_PROMPT.replace('{transcription}', transcription);

    console.log(`Generating summary with ${model}...`);

    try {
        const response = await axios.post(
            `${ollamaUrl}/api/generate`,
            {
                model: model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    num_predict: 500, // Max tokens for summary
                },
            },
            {
                timeout: 120000, // 2 minutes timeout
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.data || !response.data.response) {
            throw new Error('Invalid response from Ollama');
        }

        const summary = response.data.response.trim();

        if (summary.length < 20) {
            throw new Error('Generated summary is too short');
        }

        console.log(`Summary generated: ${summary.length} characters`);
        return summary;
    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to Ollama. Make sure Ollama is running.');
        }
        if (error.response?.status === 404) {
            throw new Error(`Model ${model} not found. Run: ollama pull ${model}`);
        }
        throw new Error(`Ollama summarization failed: ${error.message}`);
    }
}
