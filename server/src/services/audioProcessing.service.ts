import path from 'path';
import pool from '../config/db.config.js';
import { Record } from '../models/Record.js';
import { Note } from '../models/Note.js';
import { transcribeAudio } from './transcription.service.js';
import { generateSummary } from './summarization.service.js';

/**
 * Processes an audio record through the complete pipeline:
 * 1. Transcription (Whisper.cpp)
 * 2. Summarization (Ollama)
 * 3. Database update
 */
export async function processAudioRecord(recordId: number): Promise<void> {
    console.log(`\n=== Starting audio processing for record ${recordId} ===`);

    try {
        // Step 1: Get record details
        const record = await Record.getRecordById(recordId);
        if (!record) {
            throw new Error(`Record ${recordId} not found`);
        }

        console.log(`Record found: ${record.title}`);

        // Step 2: Update status to processing
        await Record.updateRecordStatus(recordId, 'processing');
        console.log('Status updated to: processing');

        // Step 3: Get full file path
        // file_uri is like "/uploads/audio-1767513956792-747637638.m4a"
        const fileName = path.basename(record.file_uri);
        const filePath = path.join(process.cwd(), 'uploads', fileName);
        console.log(`Audio file path: ${filePath}`);

        // Step 4: Transcribe audio
        console.log('Step 1/3: Transcribing audio...');
        const transcription = await transcribeAudio(filePath);

        if (!transcription || transcription.length < 10) {
            throw new Error('Transcription is empty or too short');
        }

        console.log(`✓ Transcription completed: ${transcription.length} characters`);

        // Step 5: Store transcription in database (for reference/debugging)
        await pool.query(
            'UPDATE records SET transcription = $1, updated_at = CURRENT_TIMESTAMP WHERE id_record = $2',
            [transcription, recordId]
        );
        console.log('✓ Transcription saved to database');

        // Step 6: Generate summary
        console.log('Step 2/3: Generating summary with AI...');
        const summary = await generateSummary(transcription);

        if (!summary || summary.length < 20) {
            throw new Error('Generated summary is too short');
        }

        console.log(`✓ Summary generated: ${summary.length} characters`);

        // Step 7: Update note with summary
        console.log('Step 3/3: Updating note...');
        const notes = await Note.getNotesByRecordId(recordId);

        if (notes.length > 0) {
            // Update existing note
            await Note.updateNote(notes[0].id_note, summary);
            console.log(`✓ Note ${notes[0].id_note} updated with summary`);
        } else {
            // Create new note if none exists
            await Note.createNote(recordId, record.id_user, summary);
            console.log('✓ New note created with summary');
        }

        // Step 8: Mark record as completed
        await Record.updateRecordStatus(recordId, 'completed');
        console.log('✓ Status updated to: completed');

        console.log(`=== Successfully processed record ${recordId} ===\n`);
    } catch (error: any) {
        console.error(`\n✗ Error processing record ${recordId}:`, error.message);

        // Update record with error status and message
        try {
            await pool.query(
                'UPDATE records SET status = $1, error_message = $2, updated_at = CURRENT_TIMESTAMP WHERE id_record = $3',
                ['error', error.message, recordId]
            );
            console.log('✗ Status updated to: error');
        } catch (dbError) {
            console.error('Failed to update error status in database:', dbError);
        }

        // Re-throw error for queue to handle
        throw error;
    }
}
