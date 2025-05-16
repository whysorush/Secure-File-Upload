const File = require('../models/File');
const { Queue } = require('bullmq');
const path = require('path');
const fs = require('fs').promises;

// Initialize BullMQ queue
const fileProcessingQueue = new Queue('file-processing', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = await File.create({
      userId: req.user.id,
      originalFilename: req.file.originalname,
      storagePath: req.file.path,
      title: req.body.title,
      description: req.body.description,
      status: 'uploaded'
    });

    // Add job to queue
    await fileProcessingQueue.add('process-file', {
      fileId: file.id,
      filePath: req.file.path
    });

    res.status(201).json({
      id: file.id,
      status: file.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
};

const getFileStatus = async (req, res) => {
  try {
    const file = await File.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      id: file.id,
      originalFilename: file.originalFilename,
      title: file.title,
      description: file.description,
      status: file.status,
      extractedData: file.extractedData,
      uploadedAt: file.uploadedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving file status' });
  }
};

module.exports = {
  uploadFile,
  getFileStatus
}; 