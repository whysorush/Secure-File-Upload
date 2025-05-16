const express = require('express');
const router = express.Router();
const { uploadFile, getFileStatus } = require('../controllers/fileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/:id', auth, getFileStatus);

module.exports = router; 