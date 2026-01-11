import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config();

/**
 * Converts audio file to WAV format using ffmpeg
 * @param inputPath Path to input audio file
 * @param outputPath Path to output WAV file
 */
async function convertToWav(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(`Converting ${path.basename(inputPath)} to WAV format...`);

        const ffmpeg = spawn("ffmpeg", [
            "-i",
            inputPath,
            "-ar",
            "16000", // 16kHz sample rate (Whisper.cpp optimal)
            "-ac",
            "1", // mono
            "-c:a",
            "pcm_s16le", // 16-bit PCM
            "-y", // overwrite output file
            outputPath,
        ]);

        let stderr = "";

        ffmpeg.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        ffmpeg.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`ffmpeg conversion failed: ${stderr}`));
                return;
            }
            console.log("✓ Audio converted to WAV");
            resolve();
        });

        ffmpeg.on("error", (error) => {
            reject(new Error(`ffmpeg error: ${error.message}`));
        });
    });
}

/**
 * Transcribes audio file using Whisper.cpp
 * @param audioFilePath Absolute path to the audio file
 * @returns Transcription text
 */
export async function transcribeAudio(audioFilePath: string): Promise<string> {
    const whisperExec = process.env.WHISPER_EXECUTABLE_PATH;
    const modelPath = process.env.WHISPER_MODEL_PATH;

    if (!whisperExec || !modelPath) {
        throw new Error("Whisper configuration missing in .env file");
    }

    // Verify files exist
    try {
        await fs.access(whisperExec);
        await fs.access(modelPath);
        await fs.access(audioFilePath);
    } catch (error) {
        throw new Error(`File not found: ${error}`);
    }

    const outputDir = path.dirname(audioFilePath);
    const baseName = path.basename(audioFilePath, path.extname(audioFilePath));
    const wavFilePath = path.join(outputDir, `${baseName}.wav`);

    // Convert audio to WAV if not already WAV
    const ext = path.extname(audioFilePath).toLowerCase();
    if (ext !== ".wav") {
        try {
            await convertToWav(audioFilePath, wavFilePath);
        } catch (error: any) {
            throw new Error(`Audio conversion failed: ${error.message}`);
        }
    } else {
        // If already WAV, use it directly
        await fs.copyFile(audioFilePath, wavFilePath);
    }

    const outputName = baseName;

    console.log(`Transcribing ${path.basename(wavFilePath)} with Whisper.cpp...`);

    return new Promise(async (resolve, reject) => {
        const whisper = spawn(whisperExec, [
            "-m",
            modelPath,
            "-l",
            "fr", // Force French language
            "--output-txt",
            "--output-file",
            path.join(outputDir, outputName),
            "-t",
            "4", // 4 threads
            wavFilePath, // File path at the end (new syntax)
        ]);

        let stderr = "";
        let stdout = "";

        whisper.stderr.on("data", (data) => {
            stderr += data.toString();
            // Whisper outputs progress to stderr, so we can log it
            const lines = data.toString().split("\n");
            lines.forEach((line: string) => {
                if (line.trim()) {
                    console.log(`Whisper: ${line.trim()}`);
                }
            });
        });

        whisper.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        whisper.on("close", async (code) => {
            if (code !== 0) {
                reject(new Error(`Whisper failed with code ${code}: ${stderr}`));
                return;
            }

            try {
                const txtFile = path.join(outputDir, `${outputName}.txt`);
                const transcription = await fs.readFile(txtFile, "utf-8");

                if (!transcription || transcription.trim().length < 10) {
                    reject(new Error("Transcription is empty or too short"));
                    return;
                }

                console.log(`Transcription completed: ${transcription.length} characters`);

                // Clean up temporary WAV file
                if (ext !== ".wav") {
                    try {
                        await fs.unlink(wavFilePath);
                        console.log("✓ Temporary WAV file cleaned up");
                    } catch (cleanupErr) {
                        console.warn("Warning: Failed to cleanup WAV file:", cleanupErr);
                    }
                }

                resolve(transcription.trim());
            } catch (error) {
                // Clean up WAV file even on error
                if (ext !== ".wav") {
                    try {
                        await fs.unlink(wavFilePath);
                    } catch (cleanupErr) {
                        // Ignore cleanup errors
                    }
                }
                reject(new Error(`Failed to read transcription file: ${error}`));
            }
        });

        whisper.on("error", (error) => {
            reject(new Error(`Whisper process error: ${error.message}`));
        });
    });
}
