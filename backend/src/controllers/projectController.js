import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to delete local uploaded file
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  try {
    const fileName = fileUrl.replace('/uploads/', '');
    const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete local file ${fileUrl}:`, err.message);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const projects = await Project.find(query);
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res) => {
  try {
    const { title, description, category, technologies, githubLink, liveLink } = req.body;

    // Check files
    let primaryImage = '';
    let screenshots = [];
    let docFile = '';

    if (req.files) {
      if (req.files.primaryImage && req.files.primaryImage[0]) {
        primaryImage = `/uploads/${req.files.primaryImage[0].filename}`;
      }
      if (req.files.screenshots) {
        screenshots = req.files.screenshots.map(file => `/uploads/${file.filename}`);
      }
      if (req.files.docFile && req.files.docFile[0]) {
        docFile = `/uploads/${req.files.docFile[0].filename}`;
      }
    }

    if (!title || !description || !category || !primaryImage) {
      // Clean up files if validation fails
      if (primaryImage) deleteLocalFile(primaryImage);
      screenshots.forEach(deleteLocalFile);
      if (docFile) deleteLocalFile(docFile);

      return res.status(400).json({ success: false, message: 'Please provide title, description, category, and primary image.' });
    }

    // Convert technologies string/array to array
    let techArray = [];
    if (technologies) {
      techArray = Array.isArray(technologies) 
        ? technologies 
        : technologies.split(',').map(tech => tech.trim());
    }

    const project = await Project.create({
      title,
      description,
      category,
      technologies: techArray,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      primaryImage,
      screenshots,
      docFile
    });

    res.status(201).json({ success: true, message: 'Project created successfully!', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, category, technologies, githubLink, liveLink, keepScreenshots } = req.body;
    const updates = {
      title: title || project.title,
      description: description || project.description,
      category: category || project.category,
      githubLink: githubLink !== undefined ? githubLink : project.githubLink,
      liveLink: liveLink !== undefined ? liveLink : project.liveLink
    };

    if (technologies) {
      updates.technologies = Array.isArray(technologies) 
        ? technologies 
        : technologies.split(',').map(tech => tech.trim());
    }

    // File updates
    if (req.files) {
      if (req.files.primaryImage && req.files.primaryImage[0]) {
        // Delete old image
        deleteLocalFile(project.primaryImage);
        updates.primaryImage = `/uploads/${req.files.primaryImage[0].filename}`;
      }

      if (req.files.screenshots && req.files.screenshots.length > 0) {
        // Delete old screenshots unless keepScreenshots option is true
        const keepOld = keepScreenshots === 'true' || keepScreenshots === true;
        if (!keepOld) {
          project.screenshots.forEach(deleteLocalFile);
          updates.screenshots = req.files.screenshots.map(file => `/uploads/${file.filename}`);
        } else {
          updates.screenshots = [
            ...project.screenshots,
            ...req.files.screenshots.map(file => `/uploads/${file.filename}`)
          ];
        }
      }

      if (req.files.docFile && req.files.docFile[0]) {
        // Delete old doc file
        if (project.docFile) deleteLocalFile(project.docFile);
        updates.docFile = `/uploads/${req.files.docFile[0].filename}`;
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Project updated successfully!', project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated files locally
    deleteLocalFile(project.primaryImage);
    project.screenshots.forEach(deleteLocalFile);
    if (project.docFile) deleteLocalFile(project.docFile);

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
