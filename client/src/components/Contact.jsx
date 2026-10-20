import { useState } from 'react';
import { Send, Mail, MapPin, Phone, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'Attachment file size exceeds 10MB limit!' });
        return;
      }
      setAttachment(file);
      setAttachmentName(file.name);
      setStatus({ type: '', message: '' }); // Clear error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setStatus({ type: 'error', message: 'Please fulfill all required fields!' });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please supply a valid email address!' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Use FormData to support file upload attachments
      const payload = new FormData();
      payload.append('name', name);
      payload.append('email', email);
      payload.append('subject', subject);
      payload.append('message', message);
      if (attachment) {
        payload.append('attachment', attachment);
      }

      const res = await api.post('/messages', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully! I will reach back shortly.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setAttachment(null);
        setAttachmentName('');
      } else {
        setStatus({ type: 'error', message: res.data.message || 'Transmission failed.' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Server error. Please verify database configurations.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Back blur */}
      <div className="absolute right-0 top-1/2 w-80 h-80 rounded-full bg-cyber-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">Query Terminus</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Specs Meta info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-8 space-y-6">
            <h3 className="text-lg font-orbitron font-extrabold text-cyber-text tracking-wide mb-2 uppercase">
              Connection Hub
            </h3>
            <p className="text-xs md:text-sm text-cyber-textMuted leading-relaxed font-light">
              Submit your project requests, queries, or internships here. The telemetry pipeline stores items directly in database indexes and triggers real-time SMTP emails.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-cyber-primary group-hover:bg-cyber-gradient group-hover:text-white dark:group-hover:text-black transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-cyber-textMuted uppercase">Secure Email</p>
                  <a href="mailto:student@portfolio.dev" className="text-xs md:text-sm text-cyber-text hover:text-cyber-primary transition-colors font-mono">
                    student@portfolio.dev
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-cyber-accent group-hover:bg-cyber-gradient group-hover:text-white dark:group-hover:text-black transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-cyber-textMuted uppercase">Voice Line</p>
                  <a href="tel:+1234567890" className="text-xs md:text-sm text-cyber-text hover:text-cyber-accent transition-colors font-mono">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-cyber-glow group-hover:bg-cyber-gradient group-hover:text-white dark:group-hover:text-black transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-cyber-textMuted uppercase">Active Grid Node</p>
                  <span className="text-xs md:text-sm text-cyber-text font-mono">
                    Silicon Valley, CA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-6">
            {/* Status alerts */}
            {status.message && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs md:text-sm font-mono ${
                status.type === 'success' 
                  ? 'bg-cyber-glow/10 border-cyber-glow/30 text-cyber-glow' 
                  : 'bg-[#ff6b6b]/10 border-[#ff6b6b]/30 text-[#ff6b6b]'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                  Your Identifier Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                  Your Return Routing Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. john@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g. Project Consultation / Internship proposal"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                Message Body
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Enter details..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/30 resize-none"
              />
            </div>

            {/* File Attachment Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted block">
                Attach Specs / File (Max 10MB)
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-dashed border-white/10 hover:border-cyber-primary/40 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <Upload className="w-4 h-4 text-cyber-primary" />
                  <span className="text-xs text-cyber-textMuted font-mono">
                    {attachmentName || 'Attach PDF, DOC, or image...'}
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-orbitron text-cyber-text uppercase tracking-wider">
                  Browse
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-cyber-gradient text-white dark:text-black font-orbitron font-extrabold uppercase tracking-widest text-xs shadow-neon-teal hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Secure Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
