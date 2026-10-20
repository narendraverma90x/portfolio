import express from 'express';
import { getDocuments, uploadDocument, deleteDocument } from '../controllers/docController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/', protect, upload.single('file'), uploadDocument);
router.delete('/:id', protect, deleteDocument);

export default router;
