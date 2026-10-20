# Premium Glassmorphic Software Engineer Portfolio

A premium, state-of-the-art, fully responsive full-stack portfolio tailored for Software Engineers, AI/ML Developers, and student technologists. Features a stunning futuristic obsidian dark theme with micro-animations, glassmorphism overlays, and canvas-based interactive particle meshes.

---

## ⚡ Key Architectural Highlights

*   **HTML5 Canvas Constellation System**: High-performance, optimized, responsive particle mesh background that connects with glowing lines under the client cursor.
*   **Dual-Database Fallback Engine**: If no MongoDB connection is configured, the server gracefully switches to a lightweight local JSON-file database under `backend/data/`. This enables complete, database-backed CRUD operations right out-of-the-box!
*   **Local File Storage Fallback**: Uploading project images, academic certs, or resume PDFs dynamically uses local storage under `backend/public/uploads` and serves them statically if remote Cloudinary keys are not provided.
*   **Automated Admin Seeding**: Instantly provisions a default administrator user and mounts premium engineering mock projects and verified documents on initial database boot.
*   **Full CRUD Admin Dashboard**: Lockable console panel allowing creators to manage projects (multi-screenshot galleries + PDF documentation attachment), documents (academic certs/resumes with inline PDF preview), contact forms (inbox reader), and config customized biographical details on the fly.

---

## 🛠️ Project Directory Tree

```
portfolio/
├── backend/                  # Node.js + Express API server
│   ├── data/                 # JSON file fallback storage directory
│   ├── public/uploads/       # Local disk uploads fallback directory
│   ├── src/
│   │   ├── config/           # Database driver and seeding routines
│   │   ├── controllers/      # Route logic handlers (Projects, Docs, Messages, Auth)
│   │   ├── middleware/       # Multer multi-upload & JWT security protect filters
│   │   ├── models/           # Dynamic schemas wrapping MongoDB or local JSON collections
│   │   ├── routes/           # Express router endpoints
│   │   └── server.js         # API entry point
│   ├── .env                  # Port, JWT secret, and SMTP settings
│   └── package.json
└── client/                   # React SPA + Tailwind v3 + Framer Motion
    ├── src/
    │   ├── assets/           # Global icons and assets
    │   ├── components/       # ParticleBackground, CustomCursor, Navbar, and UI sections
    │   ├── context/          # JWT Session AuthContext providers
    │   ├── pages/            # Admin dashboard and main portfolio layouts
    │   ├── utils/            # Axios API wrappers with auth token interceptors
    │   └── App.jsx           # App state manager
    ├── index.html            # Main markup with SEO metadata
    └── package.json
```

---

## 🚀 Setup & Launch Protocol

### 1. Prerequisite Checks
Ensure you have **Node.js (v18+)** installed.

### 2. Configure Environment variables
Navigate into `backend/.env` to configure ports, JWT, or database credentials.

*   By default, leaving `MONGODB_URI` and `CLOUDINARY` blank will trigger the **local database and file storage fallbacks**, meaning the entire application works 100% locally without configuring anything!

---

### 3. Launching Server & Client

You can run both client and server from two terminals:

#### Terminal 1: Run Express Server API
```bash
cd backend
npm install
npm run start
```
*   *Seeding will trigger automatically on first boot!*
*   **Default Administrative Credentials:**
    *   **Email:** `admin@portfolio.dev`
    *   **Password:** `adminpassword123`

#### Terminal 2: Run React Client Application
```bash
cd client
npm install
npm run dev
```
*   Your futuristic portfolio client will boot up on **`http://localhost:5173`**!
*   Click the **Console** button on the top right navigation bar to log into the Admin System!

---

## 📦 Production Deployment Recommendation

1.  **Backend API Hosting**: Render, Heroku, AWS Elastic Beanstalk, or DigitalOcean Droplets.
2.  **Frontend Static Hosting**: Vercel, Netlify, or AWS Amplify.
3.  **Production Database**: MongoDB Atlas (Free Tier). Include your remote URI in `MONGODB_URI` environment variable.
4.  **Production Cloud Storage**: Create a Cloudinary account, and insert your API keys in the `.env` configuration to switch from local disk uploads to production-optimized CDN rendering!
