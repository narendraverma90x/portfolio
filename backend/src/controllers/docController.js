import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
export const getDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }

    let documents = await Document.find(query);

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      documents = documents.filter(doc => 
        searchRegex.test(doc.title) || 
        (doc.description && searchRegex.test(doc.description))
      );
    }

    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private (Admin)
export const uploadDocument = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a document file' });
    }

    if (!title || !category) {
      deleteLocalFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Please provide title and category' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;

    const document = await Document.create({
      title,
      category,
      description: description || '',
      fileUrl,
      fileType
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully!', document });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private (Admin)
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Delete local file
    deleteLocalFile(document.fileUrl);

    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
