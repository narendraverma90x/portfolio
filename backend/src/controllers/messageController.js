import Message from '../models/Message.js';
import nodemailer from 'nodemailer';
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

// @desc    Get all messages (queries)
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    // Sort messages: unread first, then newest first
    messages.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a new message / contact query
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    let attachmentUrl = '';
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      attachmentUrl
    });

    // Simulating/Triggering Nodemailer if configured
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL } = process.env;
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_RECEIVER_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587'),
          secure: parseInt(SMTP_PORT || '587') === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
          }
        });

        const mailOptions = {
          from: `"${name}" <${email}>`,
          to: CONTACT_RECEIVER_EMAIL,
          subject: `Portfolio Contact: ${subject}`,
          text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #4f46e5; margin-top: 0;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6;">${message}</p>
            </div>
          `
        };

        if (attachmentUrl) {
          const fileName = req.file.originalname;
          const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
          mailOptions.attachments = [
            {
              filename: fileName,
              path: filePath
            }
          ];
        }

        await transporter.sendMail(mailOptions);
        console.log('📬 Contact email sent successfully!');
      } catch (mailError) {
        console.error('⚠️ Nodemailer failed to send email:', mailError.message);
      }
    }

    res.status(201).json({ success: true, message: 'Message submitted successfully!', data: newMessage });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark query as read
// @route   PUT /api/messages/:id/read
// @access  Private (Admin)
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const updated = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, message: 'Message marked as read', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact query
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Delete attachment file if exists
    if (message.attachmentUrl) {
      deleteLocalFile(message.attachmentUrl);
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
