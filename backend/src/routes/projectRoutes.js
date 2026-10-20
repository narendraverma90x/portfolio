import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Define multi-field file upload configurations
const projectUpload = upload.fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 6 },
  { name: 'docFile', maxCount: 1 }
]);

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post('/', protect, projectUpload, createProject);
router.put('/:id', protect, projectUpload, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
