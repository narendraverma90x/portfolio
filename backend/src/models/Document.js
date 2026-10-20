import mongoose from 'mongoose';
import { getModel } from '../config/db.js';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Certificate', 'Research Paper', 'Internship', 'Resume', 'Other']
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: 'application/pdf'
  },
  description: {
    type: String,
    default: ''
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Document = getModel('Document', documentSchema);
export default Document;
