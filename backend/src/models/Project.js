import mongoose from 'mongoose';
import { getModel } from '../config/db.js';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'AI/ML', 'Cloud & DevOps', 'Full Stack', 'Mobile App']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  githubLink: {
    type: String,
    default: ''
  },
  liveLink: {
    type: String,
    default: ''
  },
  primaryImage: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  docFile: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = getModel('Project', projectSchema);
export default Project;
