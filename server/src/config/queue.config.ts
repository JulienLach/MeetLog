import PQueue from 'p-queue';

// Simple in-memory queue with concurrency control
// Alternative to Bull/Redis for simpler setup
export const audioQueue = new PQueue({
    concurrency: 2, // Process 2 jobs at a time
    timeout: 600000, // 10 minutes timeout per job
});

// Log queue status
audioQueue.on('active', () => {
    console.log(`Queue is processing. Size: ${audioQueue.size}, Pending: ${audioQueue.pending}`);
});

audioQueue.on('idle', () => {
    console.log('Queue is idle - all jobs processed');
});

audioQueue.on('error', (error) => {
    console.error('Queue error:', error);
});

export interface AudioProcessingJob {
    recordId: number;
}

console.log('Audio processing queue initialized');
