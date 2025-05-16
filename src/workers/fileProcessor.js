const { Worker } = require('bullmq');
const File = require('../models/File');
const crypto = require('crypto');
const fs = require('fs').promises;

const processFile = async (job) => {
  const { fileId, filePath } = job.data;

  try {
    // Update file status to processing
    await File.update(
      { status: 'processing' },
      { where: { id: fileId } }
    );

    // Read file content
    const fileContent = await fs.readFile(filePath);

    // Calculate file hash (as an example of processing)
    const fileHash = crypto
      .createHash('sha256')
      .update(fileContent)
      .digest('hex');

    // Update file status and extracted data
    await File.update(
      {
        status: 'processed',
        extractedData: JSON.stringify({
          hash: fileHash,
          size: fileContent.length,
          processedAt: new Date().toISOString()
        })
      },
      { where: { id: fileId } }
    );

    return { success: true, fileId };
  } catch (error) {
    // Update file status to failed
    await File.update(
      {
        status: 'failed',
        extractedData: JSON.stringify({
          error: error.message,
          failedAt: new Date().toISOString()
        })
      },
      { where: { id: fileId } }
    );

    throw error;
  }
};

// Initialize worker
const worker = new Worker('file-processing', processFile, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed for file ${job.data.fileId}`);
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed for file ${job.data.fileId}:`, error);
});

module.exports = worker; 