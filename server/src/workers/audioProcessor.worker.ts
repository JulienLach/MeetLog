import { audioQueue, AudioProcessingJob } from '../config/queue.config.js';
import { processAudioRecord } from '../services/audioProcessing.service.js';

/**
 * Adds an audio processing job to the queue
 * @param recordId The ID of the record to process
 * @returns Promise that resolves when job is queued (not when it completes)
 */
export async function queueAudioProcessing(recordId: number): Promise<void> {
    console.log(`Queueing audio processing job for record ${recordId}`);

    // Add job to queue - it will be processed asynchronously
    audioQueue.add(async () => {
        try {
            await processAudioRecord(recordId);
            console.log(`✓ Job completed for record ${recordId}`);
        } catch (error: any) {
            console.error(`✗ Job failed for record ${recordId}:`, error.message);
            // Error is already logged in processAudioRecord
            // and database is already updated with error status
            throw error; // Re-throw to mark job as failed
        }
    });

    console.log(`Job queued. Queue size: ${audioQueue.size}, Pending: ${audioQueue.pending}`);
}

/**
 * Gets current queue status
 */
export function getQueueStatus() {
    return {
        size: audioQueue.size,
        pending: audioQueue.pending,
        isPaused: audioQueue.isPaused,
    };
}

console.log('Audio processor worker initialized');

export { audioQueue };
