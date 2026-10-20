import Project from '../models/Project.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import PortfolioContent from '../models/PortfolioContent.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const placeholderProjects = [
  {
    title: 'Aetheric NLP Assistant',
    description: 'An AI-powered natural language processing tool that performs abstractive summarization, entity recognition, and sentiment classification using lightweight LLM fine-tuning. Built with an interactive streaming dashboard for instant response analysis.',
    category: 'AI/ML',
    technologies: ['React.js', 'Python', 'PyTorch', 'FastAPI', 'Tailwind CSS'],
    githubLink: 'https://github.com/developerstudent/aetheric-nlp',
    liveLink: 'https://aetheric-nlp.demo.dev',
    primaryImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    screenshots: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60'
    ],
    docFile: ''
  },
  {
    title: 'Nexus Cloud DevOps Control',
    description: 'A beautiful cloud management console designed for engineering students to monitor Kubernetes clusters, check Docker logs, and deploy static websites using single-click webhooks. Incorporates real-time Prometheus statistics and graphs.',
    category: 'Cloud & DevOps',
    technologies: ['Next.js', 'Node.js', 'Docker', 'Kubernetes', 'Prometheus', 'Redis'],
    githubLink: 'https://github.com/developerstudent/nexus-cloud',
    liveLink: 'https://nexus-devops.demo.dev',
    primaryImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=60',
    screenshots: [
      'https://images.unsplash.com/photo-1664575198308-3959904fa430?w=800&auto=format&fit=crop&q=60'
    ],
    docFile: ''
  },
  {
    title: 'Synapse Distributed Database',
    description: 'A lightweight, high-performance in-memory key-value database built from scratch to study TCP/IP sockets, buffer pool management, and index search algorithms. Includes custom clustering replication protocols.',
    category: 'Backend',
    technologies: ['C++', 'Go', 'Redis', 'Docker', 'Linux Shell'],
    githubLink: 'https://github.com/developerstudent/synapse-db',
    liveLink: '',
    primaryImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    screenshots: [],
    docFile: ''
  }
];

const placeholderDocs = [
  {
    title: 'AWS Certified Cloud Practitioner Certificate',
    category: 'Certificate',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Earned AWS practitioner credential showcasing skills in cloud architectures, pricing structures, and fundamental security operations.'
  },
  {
    title: 'Research Paper: Microservice Container Optimizations',
    category: 'Research Paper',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Conducted academic review on optimizing Docker multi-stage build size footprints, reducing server spin-up overhead latency by 32%.'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Check Projects
    const projectCount = await Project.countDocuments({});
    if (projectCount === 0) {
      await Project.create(placeholderProjects);
      console.log('✅ Placeholder projects seeded successfully!');
    }

    // Check Documents
    const docCount = await Document.countDocuments({});
    if (docCount === 0) {
      await Document.create(placeholderDocs);
      console.log('✅ Placeholder documents seeded successfully!');
    }

    console.log('🚀 Seed system checked successfully! Everything is ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Data seed process failed:', err.message);
    process.exit(1);
  }
};

seedData();
