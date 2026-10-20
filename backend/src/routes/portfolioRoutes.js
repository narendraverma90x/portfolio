import express from 'express';
import { getPortfolioContent, updatePortfolioContent } from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolioContent);
router.post('/:key', protect, updatePortfolioContent);

export default router;
