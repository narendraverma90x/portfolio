import mongoose from 'mongoose';
import { getModel } from '../config/db.js';

const portfolioContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PortfolioContent = getModel('PortfolioContent', portfolioContentSchema);
export default PortfolioContent;
