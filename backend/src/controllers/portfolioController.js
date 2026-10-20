import PortfolioContent from '../models/PortfolioContent.js';

// Smart fallback default configurations for first-time use
const DEFAULT_CONTENT = {
  about: {
    intro: "I am an enthusiastic Software Engineer student passionate about developing cutting-edge AI/ML systems, clean web architectures, and scalable cloud solutions. I thrive in challenging environments and love solving architectural puzzles.",
    objective: "To obtain a challenging role as a Software Engineer where I can apply my full-stack expertise, AI/ML skills, and DevOps mindset to build premium, next-generation user experiences.",
    stats: [
      { id: 'projects', label: 'Projects Completed', value: '12+' },
      { id: 'certificates', label: 'Certifications', value: '8+' },
      { id: 'experience', label: 'Months Experience', value: '6+' },
      { id: 'gpa', label: 'Academic GPA', value: '3.9/4.0' }
    ]
  },
  skills: {
    frontend: [
      { name: 'React.js / Next.js', level: 90 },
      { name: 'JavaScript (ES6+) / TS', level: 85 },
      { name: 'Tailwind CSS / Glassmorphism', level: 95 },
      { name: 'Framer Motion / Canvas', level: 80 }
    ],
    backend: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'REST APIs / GraphQL', level: 85 },
      { name: 'Python (FastAPI / Flask)', level: 75 },
      { name: 'Java / Spring Boot', level: 60 }
    ],
    ai_ml: [
      { name: 'Python / NumPy / Pandas', level: 85 },
      { name: 'TensorFlow / PyTorch', level: 70 },
      { name: 'NLP & LLM Fine-Tuning', level: 65 },
      { name: 'Computer Vision (OpenCV)', level: 60 }
    ],
    cloud_devops: [
      { name: 'Docker / Containerization', level: 80 },
      { name: 'AWS (S3, EC2, Lambda)', level: 70 },
      { name: 'GitHub Actions (CI/CD)', level: 75 },
      { name: 'Linux / Bash Scripting', level: 80 }
    ],
    databases: [
      { name: 'MongoDB / Mongoose', level: 90 },
      { name: 'PostgreSQL / SQL', level: 80 },
      { name: 'Redis / Caching', level: 65 },
      { name: 'Firebase / Firestore', level: 85 }
    ]
  },
  experience: []
};

// @desc    Get all portfolio content customizations
// @route   GET /api/portfolio
// @access  Public
export const getPortfolioContent = async (req, res) => {
  try {
    const contents = await PortfolioContent.find({});
    
    // Map list of dynamic content key-values into a single clean dictionary
    const formattedContent = { ...DEFAULT_CONTENT };
    contents.forEach(item => {
      formattedContent[item.key] = item.value;
    });

    res.json({ success: true, data: formattedContent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update specific portfolio key content
// @route   POST /api/portfolio/:key
// @access  Private (Admin)
export const updatePortfolioContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide content value' });
    }

    // Find and update or create
    let content = await PortfolioContent.findOne({ key });
    if (content) {
      content = await PortfolioContent.findByIdAndUpdate(content._id, { value, updatedAt: new Date() }, { new: true });
    } else {
      content = await PortfolioContent.create({ key, value });
    }

    res.json({ success: true, message: `Portfolio ${key} updated successfully!`, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
