import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, FileText, Mail, Settings, Plus, Trash2, Edit2, 
  Eye, Check, LogOut, Loader2, ArrowLeft, Upload, Sparkles, Clock,
  Briefcase
} from 'lucide-react';
import api from '../utils/api';

const Admin = ({ onBackToPortfolio, onContentUpdate, onProjectsChange, onDocumentsChange, initialProjects = [], initialDocuments = [] }) => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState(initialProjects);
  const [documents, setDocuments] = useState(initialDocuments);
  const [messages, setMessages] = useState([]);
  const [experience, setExperience] = useState([]);

  const projectList = Array.isArray(projects) ? projects : [];
  const documentList = Array.isArray(documents) ? documents : [];
  const messageList = Array.isArray(messages) ? messages : [];
  const experienceList = Array.isArray(experience) ? experience : [];

  const formatMessageDate = (dateVal) => {
    if (!dateVal) return 'Unknown Date';
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? 'Unknown Date' : d.toLocaleString();
  };

  // Experience action forms state
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({
    title: '',
    company: '',
    date: '',
    details: '',
    isAchievement: false
  });
  
  // Customizer state
  const [portfolioMeta, setPortfolioMeta] = useState({
    intro: '',
    objective: ''
  });

  // Action forms state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    technologies: '',
    githubLink: '',
    liveLink: ''
  });
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [docFile, setDocFile] = useState(null);

  const [showDocForm, setShowDocForm] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Certificate',
    description: ''
  });
  const [docUploadFile, setDocUploadFile] = useState(null);

  const [apiLoading, setApiLoading] = useState(false);
  const [banner, setBanner] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [projRes, docRes, msgRes, metaRes] = await Promise.all([
        api.get('/projects'),
        api.get('/documents'),
        api.get('/messages'),
        api.get('/portfolio')
      ]);

      if (projRes.data.success) {
        setProjects(projRes.data.projects);
        if (onProjectsChange) onProjectsChange(projRes.data.projects);
      }
      if (docRes.data.success) {
        setDocuments(docRes.data.documents);
        if (onDocumentsChange) onDocumentsChange(docRes.data.documents);
      }
      if (msgRes.data.success) setMessages(msgRes.data.messages);
      if (metaRes.data.success) {
        setPortfolioMeta({
          intro: metaRes.data.data.about?.intro || '',
          objective: metaRes.data.data.about?.objective || ''
        });
        setExperience(metaRes.data.data.experience || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err.message);
    }
  };

  const showBanner = (type, text) => {
    setBanner({ type, text });
    setTimeout(() => setBanner({ type: '', text: '' }), 4000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Fill in all fields');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    
    const res = await login(loginEmail, loginPassword);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      showBanner('success', 'Terminal security clearance granted. Welcome back!');
    }
  };

  // Projects CRUD operations
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showBanner('error', 'Please complete title and description!');
      return;
    }

    setApiLoading(true);
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('category', projectForm.category);
    formData.append('technologies', projectForm.technologies);
    formData.append('githubLink', projectForm.githubLink);
    formData.append('liveLink', projectForm.liveLink);

    if (primaryImageFile) formData.append('primaryImage', primaryImageFile);
    if (docFile) formData.append('docFile', docFile);
    screenshotFiles.forEach(file => {
      formData.append('screenshots', file);
    });

    try {
      let res;
      if (editingProject) {
        res = await api.put(`/projects/${editingProject._id || editingProject.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!primaryImageFile) {
          showBanner('error', 'Please upload a cover primary image!');
          setApiLoading(false);
          return;
        }
        res = await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        showBanner('success', editingProject ? 'Project revised!' : 'New project compiled!');
        setShowProjectForm(false);
        setEditingProject(null);
        resetProjectForm();
        fetchDashboardData();
      }
    } catch (err) {
      showBanner('error', err.response?.data?.message || 'Transaction failed!');
    } finally {
      setApiLoading(false);
    }
  };

  const handleEditProjectClick = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      technologies: proj.technologies?.join(', ') || '',
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || ''
    });
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Execute terminal instructions to delete this project?')) return;
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        showBanner('success', 'Project removed from database registries.');
        fetchDashboardData();
      }
    } catch (err) {
      showBanner('error', 'Deletion aborted.');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'Frontend',
      technologies: '',
      githubLink: '',
      liveLink: ''
    });
    setPrimaryImageFile(null);
    setScreenshotFiles([]);
    setDocFile(null);
  };

  // Documents CRUD operations
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.title || !docUploadFile) {
      showBanner('error', 'Provide title and choose a file!');
      return;
    }

    setApiLoading(true);
    const formData = new FormData();
    formData.append('title', docForm.title);
    formData.append('category', docForm.category);
    formData.append('description', docForm.description);
    formData.append('file', docUploadFile);

    try {
      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showBanner('success', 'Academic document registered!');
        setShowDocForm(false);
        setDocForm({ title: '', category: 'Certificate', description: '' });
        setDocUploadFile(null);
        fetchDashboardData();
      }
    } catch (err) {
      showBanner('error', 'Upload aborted.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!confirm('Execute command to purge document?')) return;
    try {
      const res = await api.delete(`/documents/${id}`);
      if (res.data.success) {
        showBanner('success', 'Document purged successfully.');
        fetchDashboardData();
      }
    } catch (err) {
      showBanner('error', 'Purge failed.');
    }
  };

  // Experience CRUD operations
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company || !expForm.date) {
      showBanner('error', 'Please complete title, company/event and date!');
      return;
    }

    setApiLoading(true);
    try {
      let updatedExps = [...experienceList];
      const newExp = {
        id: editingExp ? editingExp.id : (expForm.isAchievement ? 'ach' : 'exp') + Date.now().toString(36),
        title: expForm.title,
        company: expForm.company,
        date: expForm.date,
        details: expForm.details
      };

      if (editingExp) {
        const idx = updatedExps.findIndex(item => item.id === editingExp.id);
        if (idx !== -1) updatedExps[idx] = newExp;
      } else {
        updatedExps.push(newExp);
      }

      const res = await api.post('/portfolio/experience', { value: updatedExps });
      if (res.data.success) {
        showBanner('success', editingExp ? 'Timeline record revised!' : 'New timeline record compiled!');
        setShowExpForm(false);
        setEditingExp(null);
        resetExpForm();
        fetchDashboardData();
        if (onContentUpdate) onContentUpdate();
      }
    } catch (err) {
      showBanner('error', 'Failed to save timeline record configurations.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleEditExpClick = (exp) => {
    setEditingExp(exp);
    setExpForm({
      title: exp.title,
      company: exp.company,
      date: exp.date,
      details: exp.details || '',
      isAchievement: exp.id?.startsWith('ach') || false
    });
    setShowExpForm(true);
  };

  const handleDeleteExp = async (id) => {
    if (!confirm('Execute command to purge timeline record?')) return;
    try {
      const updatedExps = experienceList.filter(item => item.id !== id);
      const res = await api.post('/portfolio/experience', { value: updatedExps });
      if (res.data.success) {
        showBanner('success', 'Timeline record purged.');
        fetchDashboardData();
        if (onContentUpdate) onContentUpdate();
      }
    } catch (err) {
      showBanner('error', 'Purge failed.');
    }
  };

  const resetExpForm = () => {
    setExpForm({
      title: '',
      company: '',
      date: '',
      details: '',
      isAchievement: false
    });
  };

  // Messages Actions
  const handleMarkMessageRead = async (id) => {
    try {
      const res = await api.put(`/messages/${id}/read`);
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Purge contact query history?')) return;
    try {
      const res = await api.delete(`/messages/${id}`);
      if (res.data.success) {
        showBanner('success', 'Query purged.');
        fetchDashboardData();
      }
    } catch (err) {
      showBanner('error', 'Failed.');
    }
  };

  // Customize Portfolio Content
  const handleSaveMeta = async (e) => {
    e.preventDefault();
    setApiLoading(true);
    try {
      const valuePayload = {
        intro: portfolioMeta.intro,
        objective: portfolioMeta.objective,
        stats: [
          { id: 'projects', label: 'Projects Completed', value: `${projectList.length}+` },
          { id: 'certificates', label: 'Certifications', value: `${documentList.filter(d=>d.category==='Certificate').length}+` },
          { id: 'experience', label: 'Timeline Events', value: `${experienceList.length}+` },
          { id: 'gpa', label: 'Academic GPA', value: '3.9/4.0' }
        ]
      };
      
      const res = await api.post('/portfolio/about', { value: valuePayload });
      if (res.data.success) {
        showBanner('success', 'Portfolio metadata successfully updated!');
        if (onContentUpdate) onContentUpdate();
      }
    } catch (err) {
      showBanner('error', 'Failed to save metadata configs.');
    } finally {
      setApiLoading(false);
    }
  };

  // Login view if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col justify-center items-center px-6 relative">
        <div className="absolute inset-0 grid-glow opacity-10 pointer-events-none" />
        
        <button 
          onClick={onBackToPortfolio}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-cyber-textMuted hover:text-cyber-text transition-all text-xs font-orbitron uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Console</span>
        </button>

        <div className="w-full max-w-md glass-panel rounded-3xl p-8 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyber-primary" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyber-primary" />

          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-orbitron font-extrabold tracking-widest text-cyber-text">
              SECURITY ACCESS
            </h2>
            <p className="text-[10px] font-mono text-cyber-primary/70 uppercase tracking-widest mt-1">
              Admin Authentication Portal
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono text-center">
                Access Denied: {authError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@portfolio.dev"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">
                Pass-phrase Code
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/20"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-cyber-gradient text-black font-orbitron font-extrabold uppercase tracking-widest text-xs shadow-neon-teal hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Decrypting Key...</span>
                </>
              ) : (
                <span>Request Clearance</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard panel
  return (
    <div className="min-h-screen bg-[#08090d] text-cyber-text font-inter pt-28 pb-20 relative">
      <div className="absolute inset-0 grid-glow opacity-10 pointer-events-none" />

      {/* Dynamic Action Alerts */}
      {banner.text && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-glass border z-50 flex items-center gap-3 text-xs md:text-sm font-mono ${
          banner.type === 'success' ? 'bg-cyber-glow/10 border-cyber-glow/30 text-cyber-glow' : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {banner.type === 'success' ? <Check className="w-5 h-5" /> : <Settings className="w-5 h-5 animate-spin" />}
          <span>{banner.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Header Console Menu */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-xl md:text-3xl font-orbitron font-black uppercase tracking-wider text-cyber-text flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyber-primary" />
              <span>Admin System Console</span>
            </h1>
            <p className="text-[10px] font-mono text-cyber-primary tracking-widest mt-1">
              Active Security Node: {user?.username} ({user?.email})
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onBackToPortfolio}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/5 text-cyber-textMuted hover:text-cyber-text text-xs font-orbitron uppercase tracking-wider transition-all"
            >
              Back to App
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-orbitron uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mb-8 bg-black/30 p-1.5 rounded-xl border border-white/5 self-start inline-flex">
          {[
            { id: 'projects', label: 'Projects CRUD', icon: FolderGit2 },
            { id: 'documents', label: 'Academic Docs', icon: FileText },
            { id: 'experience', label: 'Timeline CRUD', icon: Briefcase },
            { id: 'messages', label: 'Inbox Queries', icon: Mail, badge: messageList.filter(m => !m.isRead).length },
            { id: 'customizer', label: 'Configurator', icon: Settings },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowProjectForm(false);
                  setShowDocForm(false);
                  setShowExpForm(false);
                  setEditingProject(null);
                  setEditingExp(null);
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-orbitron text-[10px] uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyber-gradient text-black font-bold shadow-neon-teal'
                    : 'text-cyber-textMuted hover:text-cyber-text hover:bg-white/5'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {!!tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyber-primary text-black font-mono text-[8px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {!showProjectForm ? (
              <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest">
                    Projects Repository Ledger ({projectList.length})
                  </h3>
                  <button
                    onClick={() => {
                      resetProjectForm();
                      setShowProjectForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-cyber-textMuted uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Tech tools</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectList.map((proj) => (
                        <tr key={proj._id || proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-cyber-text">{proj.title}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-cyber-primary">
                              {proj.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-cyber-textMuted max-w-xs truncate">{proj.technologies?.join(', ')}</td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditProjectClick(proj)}
                              className="p-2 rounded bg-white/5 hover:bg-cyber-primary/20 text-cyber-text hover:text-cyber-primary border border-white/5 transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj._id || proj.id)}
                              className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                              title="Purge Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {projectList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-cyber-textMuted">No projects listed.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Add/Edit project Form
              <form onSubmit={handleProjectSubmit} className="glass-panel rounded-2xl p-8 border border-white/5 space-y-6 max-w-3xl mx-auto">
                <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest border-b border-white/5 pb-4">
                  {editingProject ? `Revise Project Artifact: ${editingProject.title}` : 'Compile New Project Spec'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="Enter project name..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Full Stack">Full Stack</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Enter project system architectural summaries..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Technologies used (Comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, Express, Docker, PyTorch"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">GitHub Repository URL</label>
                    <input
                      type="text"
                      value={projectForm.githubLink}
                      onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Live Simulation / Demo Link</label>
                    <input
                      type="text"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Upload Fields */}
                <div className="border border-white/5 p-6 rounded-2xl bg-black/25 space-y-4">
                  <h4 className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-primary mb-2">Upload Files Storage</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Primary image */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-cyber-textMuted uppercase block">Cover Image *</span>
                      <label className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-white/10 hover:border-cyber-primary/40 cursor-pointer">
                        <Upload className="w-4 h-4 text-cyber-primary mb-1" />
                        <span className="text-[9px] font-mono text-center text-cyber-textMuted truncate max-w-[120px]">
                          {primaryImageFile ? primaryImageFile.name : 'Choose Cover'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Documentation file */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-cyber-textMuted uppercase block">PDF Documentation</span>
                      <label className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-white/10 hover:border-cyber-primary/40 cursor-pointer">
                        <Upload className="w-4 h-4 text-cyber-primary mb-1" />
                        <span className="text-[9px] font-mono text-center text-cyber-textMuted truncate max-w-[120px]">
                          {docFile ? docFile.name : 'Choose PDF'}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Screenshots */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-cyber-textMuted uppercase block">Screenshots (Multi)</span>
                      <label className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-white/10 hover:border-cyber-primary/40 cursor-pointer">
                        <Upload className="w-4 h-4 text-cyber-accent mb-1" />
                        <span className="text-[9px] font-mono text-center text-cyber-textMuted truncate max-w-[120px]">
                          {screenshotFiles.length > 0 ? `${screenshotFiles.length} files selected` : 'Choose files'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              setScreenshotFiles(Array.from(e.target.files));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectForm(false);
                      setEditingProject(null);
                      resetProjectForm();
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-cyber-textMuted hover:text-cyber-text text-xs font-orbitron uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {apiLoading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                    <span>{editingProject ? 'Apply Specs' : 'Compile Project'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ACADEMIC DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {!showDocForm ? (
              <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest">
                    Academic Documents Registry ({documentList.length})
                  </h3>
                  <button
                    onClick={() => setShowDocForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-cyber-textMuted uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentList.map((doc) => (
                        <tr key={doc._id || doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-cyber-text">{doc.title}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-cyber-accent">
                              {doc.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-cyber-textMuted max-w-xs truncate">{doc.description || 'No summary'}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDoc(doc._id || doc.id)}
                              className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {documentList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-cyber-textMuted">No documents listed.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Document Form
              <form onSubmit={handleDocSubmit} className="glass-panel rounded-2xl p-8 border border-white/5 space-y-6 max-w-xl mx-auto">
                <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest border-b border-white/5 pb-4">
                  Upload Verified Document Ledger
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Document Title</label>
                  <input
                    type="text"
                    required
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    placeholder="AWS Practitioner Cert / Resume 2026..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Internship">Internship Document</option>
                    <option value="Resume">Resume</option>
                    <option value="Other">Other PDF</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Brief Description</label>
                  <textarea
                    rows={3}
                    value={docForm.description}
                    onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                    placeholder="Enter document verification description details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* File Select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">PDF or Document File *</label>
                  <label className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-dashed border-white/10 hover:border-cyber-primary/40 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <Upload className="w-4 h-4 text-cyber-primary" />
                      <span className="text-xs text-cyber-textMuted font-mono truncate max-w-xs">
                        {docUploadFile ? docUploadFile.name : 'Choose PDF, DOCX...'}
                      </span>
                    </div>
                    <input
                      type="file"
                      required
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setDocUploadFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-orbitron text-cyber-text uppercase tracking-wider">
                      Browse
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDocForm(false);
                      setDocForm({ title: '', category: 'Certificate', description: '' });
                      setDocUploadFile(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-cyber-textMuted hover:text-cyber-text text-xs font-orbitron uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {apiLoading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                    <span>Register Doc</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* EXPERIENCE TIMELINE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {!showExpForm ? (
              <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest">
                    Professional Timeline Ledger ({experienceList.length})
                  </h3>
                  <button
                    onClick={() => {
                      resetExpForm();
                      setShowExpForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Record</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-cyber-textMuted uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Title / Role</th>
                        <th className="py-3 px-4">Company / Event</th>
                        <th className="py-3 px-4">Date duration</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experienceList.map((exp) => (
                        <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-cyber-text flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${exp.id?.startsWith('ach') ? 'bg-cyber-accent' : 'bg-cyber-primary'}`} />
                            <span>{exp.title}</span>
                          </td>
                          <td className="py-4 px-4">{exp.company}</td>
                          <td className="py-4 px-4 text-cyber-textMuted">{exp.date}</td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditExpClick(exp)}
                              className="p-2 rounded bg-white/5 hover:bg-cyber-primary/20 text-cyber-text hover:text-cyber-primary border border-white/5 transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExp(exp.id)}
                              className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                              title="Purge Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {experienceList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-cyber-textMuted">No timeline records listed.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Add/Edit experience Form
              <form onSubmit={handleExpSubmit} className="glass-panel rounded-2xl p-8 border border-white/5 space-y-6 max-w-2xl mx-auto">
                <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest border-b border-white/5 pb-4">
                  {editingExp ? `Revise Timeline Record: ${editingExp.title}` : 'Compile New Timeline Entry'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Title / Role</label>
                    <input
                      type="text"
                      required
                      value={expForm.title}
                      onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                      placeholder="AI Engineer / Internship..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Company / Event Organizer</label>
                    <input
                      type="text"
                      required
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      placeholder="Quantum Lab / TechNovation..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Date / Duration</label>
                    <input
                      type="text"
                      required
                      value={expForm.date}
                      onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                      placeholder="Jan 2026 - Present"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col justify-end pb-1.5">
                    <label className="flex items-center gap-3 cursor-pointer select-none px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-cyber-primary/30 transition-all">
                      <input
                        type="checkbox"
                        checked={expForm.isAchievement}
                        onChange={(e) => setExpForm({ ...expForm, isAchievement: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-black text-cyber-primary focus:ring-cyber-primary"
                      />
                      <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-text">Mark as Award / Hackathon</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Details / Rationale summaries</label>
                  <textarea
                    required
                    rows={4}
                    value={expForm.details}
                    onChange={(e) => setExpForm({ ...expForm, details: e.target.value })}
                    placeholder="Pioneered NLP models, optimized Docker containers..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpForm(false);
                      setEditingExp(null);
                      resetExpForm();
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-cyber-textMuted hover:text-cyber-text text-xs font-orbitron uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {apiLoading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                    <span>{editingExp ? 'Apply Entry' : 'Compile Entry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MESSAGES INBOX TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
              <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest flex items-center gap-2">
                <span>Contact Queries Inbox ({messageList.length})</span>
                {messageList.some(m => !m.isRead) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyber-glow animate-ping" />
                )}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {messageList.map((msg) => (
                  <div
                    key={msg._id || msg.id}
                    onClick={() => handleMarkMessageRead(msg._id || msg.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative group ${
                      msg.isRead 
                        ? 'bg-black/25 border-white/5' 
                        : 'bg-cyber-primary/5 border-cyber-primary/30 shadow-neon-teal'
                    }`}
                  >
                    {/* Glowing unread bullet */}
                    {!msg.isRead && (
                      <span className="absolute top-6 left-3 w-2.5 h-2.5 rounded-full bg-cyber-primary shadow-neon-teal" />
                    )}

                    <div className="pl-4 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div>
                          <h4 className="font-orbitron font-bold text-cyber-text text-sm">{msg.subject}</h4>
                          <p className="text-[10px] font-mono text-cyber-textMuted mt-0.5">
                            From: <span className="text-cyber-primary">{msg.name}</span> (&lt;<a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>&gt;)
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 self-start md:self-center">
                          <span className="text-[9px] font-mono text-cyber-textMuted flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatMessageDate(msg.createdAt)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(msg._id || msg.id);
                            }}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-cyber-textMuted leading-relaxed font-light whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      {/* File attachment */}
                      {msg.attachmentUrl && (
                        <div className="pt-2 flex items-center gap-3">
                          <a
                            href={`${apiBaseUrl}${msg.attachmentUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/5 text-[9px] font-orbitron text-cyber-primary hover:bg-cyber-primary/10 transition-all uppercase tracking-wider"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read Attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {messageList.length === 0 && (
                  <div className="text-center py-10 text-cyber-textMuted font-mono">No incoming messages.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMIZER CONFIG TAB */}
        {activeTab === 'customizer' && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSaveMeta} className="glass-panel rounded-2xl p-8 border border-white/5 space-y-6">
              <h3 className="text-sm font-orbitron font-bold text-cyber-text uppercase tracking-widest border-b border-white/5 pb-4">
                Configurator Panel
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Dynamic About Biography Text</label>
                <textarea
                  rows={4}
                  value={portfolioMeta.intro}
                  onChange={(e) => setPortfolioMeta({ ...portfolioMeta, intro: e.target.value })}
                  placeholder="Enter custom about intro biographic details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyber-textMuted">Dynamic Career Objective Text</label>
                <textarea
                  rows={3}
                  value={portfolioMeta.objective}
                  onChange={(e) => setPortfolioMeta({ ...portfolioMeta, objective: e.target.value })}
                  placeholder="To secure an engineering role..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/45 text-cyber-text text-xs font-mono focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={apiLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-gradient text-black font-orbitron text-xs font-bold uppercase tracking-wider shadow-neon-teal hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {apiLoading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
